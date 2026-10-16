import type { ImageMetadata } from 'astro';
import { logoFor, logoScaleFor } from './eventLogos';

// 스토리 썸네일(src/assets/thumbs/*.webp, 256px 정사각형). 파일 이름은 제목에서 만든다.
// - 메인 'Chapter 39 — 40' → chapter-39 · chapter-40
// - 'Chapter 31 — 32 · OLD TALES' → old-tales · chapter-31 · chapter-32
// - 그 밖 'D.ARK HERO' → d-ark-hero, 한글 제목은 ALIASES
// 파일이 없으면 썸네일 없이 그린다.
const files = import.meta.glob<ImageMetadata>('./assets/thumbs/*.webp', {
  eager: true,
  import: 'default',
});
const byName = new Map(
  Object.entries(files).map(([path, image]) => [path.slice(path.lastIndexOf('/') + 1, -'.webp'.length), image]),
);

const ALIASES: Record<string, string> = {
  킬로: 'kilo',
  에테르: 'ether',
  모리: 'mori',
  '나가 인연 스토리': 'naga',
};

const slug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^0-9a-z]+/g, '-')
    .replace(/^-+|-+$/g, '');

const chapterName = (chapter: number) => `chapter-${String(chapter).padStart(2, '0')}`;

export interface ThumbView {
  src: string;
  caption: string;
  logo?: string; // 이벤트면 크게 보기에서 제목 대신 보여 줄 로고
  logoRatio?: number; // 로고 가로 ÷ 세로
  logoScale?: number; // 로고별 크기 보정 배율(eventLogos.ts)
}

// 제목이 가리키는 이미지 전체(크게 보기 순서). 메인 묶음은 범위 안의 모든 챕터.
export const galleryFor = (title: string): ThumbView[] => {
  const range = title.match(/^Chapter (\d+)\s*—\s*(\d+)/);
  const entries: { name: string; caption: string }[] = [];
  if (range) {
    const extra = title.split('·')[1]?.trim(); // 'Chapter 31 — 32 · OLD TALES'의 OLD TALES를 맨 앞에
    if (extra) entries.push({ name: slug(extra), caption: extra });
    for (let chapter = Number(range[1]); chapter <= Number(range[2]); chapter += 1) {
      entries.push({ name: chapterName(chapter), caption: `Chapter ${chapter}` });
    }
  } else {
    entries.push({ name: ALIASES[title] ?? slug(title), caption: title });
  }
  return entries.flatMap(({ name, caption }) => {
    const image = byName.get(name);
    if (!image) return [];
    const logo = name.startsWith('chapter-') ? undefined : logoFor(caption);
    return [
      {
        src: image.src,
        caption,
        ...(logo && {
          logo: logo.src,
          logoRatio: Number((logo.width / logo.height).toFixed(3)),
          ...(logoScaleFor(caption) && { logoScale: logoScaleFor(caption) }),
        }),
      },
    ];
  });
};

// 카드에 겹쳐 보일 장(앞에 보일 것부터): 메인 묶음은 첫 챕터 · 마지막 챕터, OLD TALES는 앞에 하나 더
export const thumbnailsFor = (title: string): ThumbView[] => {
  const gallery = galleryFor(title);
  const isChapterRange = /^Chapter \d+/.test(title);
  if (!isChapterRange || gallery.length <= 2) return gallery;
  const hasExtra = title.includes('·');
  const chapters = hasExtra ? gallery.slice(1) : gallery;
  const ends = [chapters[0], chapters[chapters.length - 1]];
  return hasExtra ? [gallery[0], ...ends] : ends;
};
