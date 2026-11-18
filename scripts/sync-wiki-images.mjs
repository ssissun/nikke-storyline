// 위키(fandom)에 새로 올라온 스토리 썸네일 · 이벤트 로고를 받아 src/assets에 넣는다.
// GitHub Actions(.github/workflows/sync-wiki-images.yml)가 매일 실행한다. 로컬 실행: node scripts/sync-wiki-images.mjs
// - 메인 챕터: 'Album Chapter NN.png' → thumbs/chapter-NN.webp
// - 그 밖 카드: Campaign/Storyline 페이지의 'Storyline *.png' → thumbs/<제목 slug>.webp
// - 이벤트 로고: Event 페이지의 '* logo.png' → logos/<제목 영문·숫자>.webp
// 교체 대기 카드는 위키 > nikke-db Album Cover > 기존 임시 이미지 순으로 선택한다.
// 위키 이미지로 교체했을 때만 대기 목록에서 뺀다. 챕터와 로고는 기존 파일을 유지한다.
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { fetchAlbumCovers } from './album-covers.mjs';

const WIKI = 'https://nikke-goddess-of-victory-international.fandom.com';
// fandom CDN은 기본 User-Agent를 403으로 막는다
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
  Referer: `${WIKI}/`,
};
const THUMB_SIZE = 256;
const LOGO_HEIGHT = 96;

const root = new URL('../', import.meta.url);
const thumbPath = (name) => new URL(`src/assets/thumbs/${name}.webp`, root);
const logoPath = (name) => new URL(`src/assets/logos/${name}.webp`, root);
const placeholdersPath = new URL('scripts/wiki-image-placeholders.json', root);
const sourcesPath = new URL('src/thumbnail-sources.json', root);
const sources = JSON.parse(await readFile(sourcesPath, 'utf8'));

// thumbnails.ts · eventLogos.ts와 같은 이름 규칙
const slug = (title) => title.toLowerCase().replace(/[^0-9a-z]+/g, '-').replace(/^-+|-+$/g, '');
const compact = (title) => title.toLowerCase().replace(/[^0-9a-z]/g, '');
const chapterName = (chapter) => `chapter-${String(chapter).padStart(2, '0')}`;

const exists = (url) => access(url).then(() => true, () => false);

const api = async (params) => {
  const response = await fetch(`${WIKI}/api.php?${new URLSearchParams({ format: 'json', ...params })}`, { headers: HEADERS });
  if (!response.ok) throw new Error(`위키 API ${response.status}: ${JSON.stringify(params)}`);
  return response.json();
};

const wikitext = async (page) => (await api({ action: 'parse', page, prop: 'wikitext' })).parse.wikitext['*'];

// 파일 이름 → 원본 URL. 위키에 없는 파일은 빠진다.
const fileUrls = async (names) => {
  const urls = new Map();
  for (let start = 0; start < names.length; start += 50) {
    const titles = names.slice(start, start + 50).map((name) => `File:${name}`).join('|');
    const { query } = await api({ action: 'query', titles, prop: 'imageinfo', iiprop: 'url' });
    for (const page of Object.values(query.pages)) {
      if (page.imageinfo) urls.set(page.title.slice('File:'.length), page.imageinfo[0].url);
    }
  }
  return urls;
};

const download = async (url) => {
  const response = await fetch(url, { headers: HEADERS });
  if (!response.ok) throw new Error(`이미지 ${response.status}: ${url}`);
  return Buffer.from(await response.arrayBuffer());
};

// 위키 문서의 [[File:...]] 중 pattern에 맞는 파일을 '제목 영문·숫자' 키로 모은다
const filesByTitle = (text, pattern, titleOf) => {
  const files = new Map();
  for (const [, name, link] of text.matchAll(/\[\[File:([^|\]]+)\|[^\]]*?(?:link=([^|\]]*))?\]\]/g)) {
    if (!pattern.test(name)) continue;
    for (const key of [compact(titleOf(name)), link && compact(link)]) {
      if (key && !files.has(key)) files.set(key, name);
    }
  }
  return files;
};

const timelineSource = (await Promise.all(['timeline', 'bonus', 'settingStories'].map((name) =>
  readFile(new URL(`src/data/${name}.ts`, root), 'utf8')))).join('\n');
const collectionTitles = [...timelineSource.matchAll(/storyTitles:\s*\[([^\]]+)\]/g)]
  .flatMap(([, values]) => [...values.matchAll(/(['"])(.*?)\1/g)].map(([, , title]) => title));
const settingTitles = [...timelineSource.matchAll(/events:\s*\[([^\]]+)\]/g)]
  .flatMap(([, values]) => [...values.matchAll(/(['"])(.*?)\1/g)].map(([, , title]) => title));
const titles = [...new Set([...timelineSource.matchAll(/^\s+title: (['"])(.+?)\1,$/gm)]
  .map(([, , title]) => title)
  .concat(collectionTitles, settingTitles))]
  .filter((title) => /^[\x20-\x7E—·]+$/.test(title)); // 한글 제목(인연 스토리 · 안내 묶음)은 위키 이미지 없음
const placeholders = JSON.parse(await readFile(placeholdersPath, 'utf8'));

const [storylineText, eventText] = await Promise.all([wikitext('Campaign/Storyline'), wikitext('Event')]);
const storylineFiles = filesByTitle(storylineText, /^Storyline .+\.png$/, (name) => name.slice('Storyline '.length, -'.png'.length));
const logoFiles = filesByTitle(eventText, /^.+ logo\.png$/, (name) => name.slice(0, -' logo.png'.length));

// 받을 목록: { file: 위키 파일 이름, out: 저장 경로, kind: 'thumb' | 'logo', title }
const wanted = [];
for (const title of titles) {
  const range = title.match(/^Chapter (\d+)\s*—\s*(\d+)/);
  const stories = range ? [title.split('·')[1]?.trim()].filter(Boolean) : [title];
  if (range) {
    for (let chapter = Number(range[1]); chapter <= Number(range[2]); chapter += 1) {
      const name = chapterName(chapter);
      if (!(await exists(thumbPath(name)))) {
        wanted.push({ file: `Album Chapter ${String(chapter).padStart(2, '0')}.png`, out: thumbPath(name), kind: 'thumb', title });
      }
    }
  }
  for (const story of stories) {
    const thumbFile = storylineFiles.get(compact(story));
    if (thumbFile && (placeholders.includes(story) || !(await exists(thumbPath(slug(story)))))) {
      wanted.push({ file: thumbFile, out: thumbPath(slug(story)), kind: 'thumb', title: story });
    }
    const logoFile = logoFiles.get(compact(story));
    if (logoFile && !(await exists(logoPath(compact(story))))) {
      wanted.push({ file: logoFile, out: logoPath(compact(story)), kind: 'logo', title: story });
    }
  }
}

const urls = await fileUrls(wanted.map(({ file }) => file));
let albumCovers = new Map();
try {
  albumCovers = await fetchAlbumCovers();
} catch (error) {
  console.warn(`Album Cover 확인 실패: ${error.message}. 위키 수집은 계속합니다.`);
}
// 위키 파일이 아직 없으면 앨범 커버를 사용한다. 앨범을 받아도 위키 교체 대기는 유지한다.
for (const title of titles.filter((title) => !/^Chapter \d+/.test(title))) {
  const name = slug(title);
  if (!placeholders.includes(title) && await exists(thumbPath(name))) continue;
  if (wanted.some((item) => item.title === title && item.kind === 'thumb' && urls.has(item.file))) continue;
  const url = albumCovers.get(compact(title));
  if (!url || sources[name]?.kind === 'wiki-storyline' ||
      (sources[name]?.kind === 'nikke-db-album' && sources[name]?.url === url && await exists(thumbPath(name)))) continue;
  wanted.push({ out: thumbPath(name), kind: 'thumb', title, directUrl: url });
}
const newThumbs = [];
for (const { file, out, kind, title, directUrl } of wanted) {
  const url = directUrl ?? urls.get(file);
  if (!url) continue;
  let bytes;
  try {
    bytes = await download(url);
    await sharp(bytes).metadata(); // 200 HTML 폴백을 이미지로 저장하지 않는다.
  } catch (error) {
    if (!directUrl) throw error;
    console.warn(`${title}: Album Cover 다운로드 실패, 기존 이미지 유지 (${error.message})`);
    continue;
  }
  const image = sharp(bytes);
  if (kind === 'thumb') {
    await image.resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover' }).webp({ quality: 82 }).toFile(fileURLToPath(out));
    if (!/^Chapter \d+/.test(title)) {
      const name = slug(title);
      const { format } = await sharp(bytes).metadata();
      const original = `${name}.${format === 'jpeg' ? 'jpg' : format}`;
      await mkdir(new URL('public/thumbnail-originals/', root), { recursive: true });
      await writeFile(new URL(`public/thumbnail-originals/${original}`, root), bytes);
      sources[name] = { kind: directUrl ? 'nikke-db-album' : 'wiki-storyline', url, original };
      if (directUrl) {
        if (!placeholders.includes(title)) placeholders.push(title);
      } else newThumbs.push(title);
    }
  } else {
    await image.trim().resize({ height: LOGO_HEIGHT }).webp({ quality: 90 }).toFile(fileURLToPath(out));
  }
  console.log(`- ${title}: ${kind === 'thumb' ? '썸네일' : '로고'} ← ${directUrl ?? file}`);
}

const remaining = placeholders.filter((title) => !newThumbs.includes(title));
await writeFile(placeholdersPath, `${JSON.stringify(remaining, null, 2)}\n`);
await writeFile(sourcesPath, `${JSON.stringify(sources, null, 2)}\n`);
