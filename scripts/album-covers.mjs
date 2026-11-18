const GALLERY = 'https://nikke-db.pages.dev/gallery';
const ASSETS = 'https://nikke-db-legacy.pages.dev/images/gallery/albums/';
export const compactTitle = (title) => title.toLowerCase().replace(/[^0-9a-z]/g, '');

// 갤러리의 공개 번들에서 Album Covers의 이름과 파일명만 읽고 코드는 실행하지 않는다.
export function parseAlbumCovers(source) {
  const marker = source.indexOf('"Album Covers"');
  if (marker < 0) return new Map();
  const start = source.indexOf('[', marker);
  const end = source.indexOf(']', start);
  if (start < 0 || end < 0) return new Map();
  const covers = new Map();
  for (const [, name, title] of source.slice(start, end).matchAll(/\{name:"(album_[a-z0-9_]+)",text:"([^"\\]+)"\}/g)) {
    covers.set(compactTitle(title), `${ASSETS}${name}.png`);
  }
  return covers;
}

export async function fetchAlbumCovers(fetcher = fetch) {
  const page = await fetcher(GALLERY);
  if (!page.ok) throw new Error(`nikke-db gallery ${page.status}`);
  const html = await page.text();
  for (const [, path] of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+\.js)["']/g)) {
    const url = new URL(path, GALLERY);
    if (url.origin !== new URL(GALLERY).origin) continue;
    const response = await fetcher(url);
    if (!response.ok) continue;
    const covers = parseAlbumCovers(await response.text());
    if (covers.size) return covers;
  }
  throw new Error('nikke-db Album Covers 목록을 찾지 못했습니다');
}
