// 방문 분석(Umami Cloud) 식별자. HTML에 그대로 노출되는 공개 값이라 비밀이 아니다.
// 비어 있으면 분석 스크립트가 페이지에 삽입되지 않는다.
// cloud.umami.is › Settings › Websites › Website ID
export const UMAMI_WEBSITE_ID = '75cae5c5-1727-486b-b78d-99de89a67d3d';

// 같은 Website를 다른 사이트와 함께 쓸 때 대시보드에서 이 사이트만 거르는 태그.
export const UMAMI_TAG = 'storyline';

// 이 호스트에서만 수집한다 (dev 서버·astro preview 방문 제외).
export const ANALYTICS_HOST = 'ssissun.github.io';
