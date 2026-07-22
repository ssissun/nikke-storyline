// 빌드마다 달라지는 식별자. version.json과 페이지에 동일한 값이 박히고,
// 클라이언트가 둘을 비교해 새 배포를 감지한다.
// CI에서는 커밋 SHA, 로컬 빌드에서는 빌드 시각을 사용한다.
export const BUILD_ID = process.env.GITHUB_SHA?.slice(0, 12) ?? String(Date.now());
