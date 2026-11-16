// Umami는 행동 종류별 페이지당 1회·속성 1개로 사용 여부를 센다. 상세 행동은 Clarity에 남긴다.
// 분석 스크립트가 없는 환경(로컬·차단)에서는 아무 일도 하지 않는다.
type Umami = { track: (event: string, data: Record<string, string>) => void };
type AnalyticsWindow = Window & { umami?: Umami; clarity?: (...args: unknown[]) => void };
const sent = new Set<string>();
const summaryProperty: Record<string, string> = {
  viewer: 'card',
  'portal-toast': 'action',
};

export const track = (name: string, data: Record<string, string>) => {
  const analytics = window as AnalyticsWindow;
  const property = summaryProperty[name];
  if (property && analytics.umami && !sent.has(name)) {
    analytics.umami.track(name, data[property] === undefined ? {} : { [property]: data[property] });
    sent.add(name);
  }
  analytics.clarity?.('event', `${name}:${Object.values(data).join(':')}`);
};
