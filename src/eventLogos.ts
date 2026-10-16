import type { ImageMetadata } from 'astro';

// 이벤트 로고(src/assets/logos/*.webp, 높이 96px, 투명 배경). 썸네일 크게 보기에서 제목 대신 쓴다.
// 파일 이름은 제목의 영문 · 숫자만 소문자로: 'BOOM\'S DAY' → boomsday, 'D.ARK HERO' → darkhero.
// 출처는 fandom 위키 Event 페이지의 Event Archiving 표(`* logo.png`).
const files = import.meta.glob<ImageMetadata>('./assets/logos/*.webp', {
  eager: true,
  import: 'default',
});
const byName = new Map(
  Object.entries(files).map(([path, image]) => [path.slice(path.lastIndexOf('/') + 1, -'.webp'.length), image]),
);

const ALIASES: Record<string, string> = { 'L.T.K — LICENSE TO KILL': 'licensetokill' };

export const logoFor = (title: string) =>
  byName.get(ALIASES[title] ?? title.toLowerCase().replace(/[^0-9a-z]/g, ''));

// 기본 크기 규칙(높이 50px · 가로 100 ~ 180px)으로는 너무 크거나 작아 보이는 로고의 배율
const LOGO_SCALE: Record<string, number> = {
  'WISDOM SPRING': 0.8,
  'L.T.K — LICENSE TO KILL': 1.25,
  'FOOTSTEP, WALK, RUN': 1.35,
  'COIN RUSH SHOWDOWN': 1.1,
  'ARCANE ARCHIVE': 1.1,
};

export const logoScaleFor = (title: string) => LOGO_SCALE[title];
