// 방문 분석 이벤트를 Umami와 Clarity에 함께 보낸다(스크립트 삽입은 Analytics.astro).
// 분석 스크립트가 없는 환경(로컬·차단)에서는 아무 일도 하지 않는다.
type Umami = { track: (event: string, data: Record<string, string>) => void };
type AnalyticsWindow = Window & { umami?: Umami; clarity?: (...args: unknown[]) => void };

export const track = (name: string, data: Record<string, string>) => {
  const analytics = window as AnalyticsWindow;
  analytics.umami?.track(name, data);
  analytics.clarity?.('event', `${name}:${Object.values(data).join(':')}`);
};
