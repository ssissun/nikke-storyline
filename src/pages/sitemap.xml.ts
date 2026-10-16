import { LAST_UPDATED } from '../data/meta';

// 검색 엔진에 알릴 페이지 목록. lastmod는 업데이트 로그의 최근 날짜를 따른다.
export const GET = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ssissun.github.io/nikke-storyline/</loc>
    <lastmod>${LAST_UPDATED}</lastmod>
  </url>
</urlset>
`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
