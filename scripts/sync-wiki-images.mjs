// 위키(fandom)에 새로 올라온 스토리 썸네일 · 이벤트 로고를 받아 src/assets에 넣는다.
// GitHub Actions(.github/workflows/sync-wiki-images.yml)가 매일 실행한다. 로컬 실행: node scripts/sync-wiki-images.mjs
// - 메인 챕터: 'Album Chapter NN.png' → thumbs/chapter-NN.webp
// - 그 밖 카드: Story/Storyline 페이지의 'Storyline *.png' → thumbs/<제목 slug>.webp
// - 이벤트 로고: Event 페이지의 '* logo.png' → logos/<제목 영문·숫자>.webp
// 이미 있는 파일은 건드리지 않는다. 단 wiki-image-placeholders.json에 적힌 카드는 임시 썸네일이라
// Storyline 이미지가 올라오면 바꾸고 목록에서 뺀다.
import { access, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

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

const timelineSource = await readFile(new URL('src/data/timeline.ts', root), 'utf8');
const titles = [...timelineSource.matchAll(/^\s+title: (['"])(.+?)\1,$/gm)]
  .map(([, , title]) => title)
  .filter((title) => /^[\x20-\x7E—·]+$/.test(title)); // 한글 제목(인연 스토리 · 안내 묶음)은 위키 이미지 없음
const placeholders = JSON.parse(await readFile(placeholdersPath, 'utf8'));

const [storylineText, eventText] = await Promise.all([wikitext('Story/Storyline'), wikitext('Event')]);
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
const newThumbs = [];
for (const { file, out, kind, title } of wanted) {
  const url = urls.get(file);
  if (!url) continue;
  const image = sharp(await download(url));
  if (kind === 'thumb') {
    await image.resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover' }).webp({ quality: 82 }).toFile(fileURLToPath(out));
    newThumbs.push(title);
  } else {
    await image.trim().resize({ height: LOGO_HEIGHT }).webp({ quality: 90 }).toFile(fileURLToPath(out));
  }
  console.log(`- ${title}: ${kind === 'thumb' ? '썸네일' : '로고'} ← ${file}`);
}

const remaining = placeholders.filter((title) => !newThumbs.includes(title));
if (remaining.length !== placeholders.length) {
  await writeFile(placeholdersPath, `${JSON.stringify(remaining, null, 2)}\n`);
}
