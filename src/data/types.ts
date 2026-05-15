export type Category = 'main' | 'event' | 'side' | 'affinity';

export type Importance = 'high' | 'medium' | 'low';

export interface StoryCard {
  type: 'card';
  title: string;
  titleScript?: 'en' | 'kor'; // default 'en'. 한글 제목('디젤' 등)은 'kor'
  category: Category;
  required: boolean;
  importance?: Importance; // 선택(opt) 카드일 때 의미
  noDub?: boolean;
  noArchive?: boolean;
  anniversary?: string; // 주년·신년 마커 (예: '0.5주년', '24 신년')
  /**
   * annotations: HTML allowed (em/strong 사용)
   */
  annotations?: string[];
}

export interface ArcDividerItem {
  type: 'divider';
  text: string;
}

export interface OptionalEventsGroup {
  type: 'optional-events';
  title: string; // "선택적 감상 이벤트 스토리"
  description: string; // HTML allowed
  items: { title: string; meta: string }[];
}

export interface RouteEntry {
  name: string; // "ROUTE 1", "ROUTE 2", etc.
  path: string;
  description: string; // HTML allowed
  best?: boolean; // ROUTE 2에 ★ 강조
}

export interface OldTalesGroup {
  type: 'old-tales';
  title: string; // "Chapter 31 — 32 · OLD TALES"
  anniversary?: string; // 주년·신년 마커 (예: '2주년')
  description: string; // HTML allowed
  routes: RouteEntry[];
  innerNote: string; // HTML allowed
  // 카테고리: 메인 + 이벤트, 필수성: 필수 — 컴포넌트에서 고정 렌더링
}

export type TimelineItem =
  | StoryCard
  | ArcDividerItem
  | OptionalEventsGroup
  | OldTalesGroup;

export interface NoteCard {
  tag: string;
  title: string;
  body: string; // HTML allowed
}

export interface BonusCard {
  tag: string;
  title: string;
  bullets: string[]; // HTML allowed
  related: {
    type: 'nikke' | 'squad';
    value: string;
  };
}

export interface LegendCategory {
  category: Category;
  label: string;
  description: string;
}

/**
 * 좌·우 lane 결정 규칙: 메인·사이드는 우측, 이벤트·호감도는 좌측
 */
export function laneFor(category: Category): 'left' | 'right' {
  return category === 'main' || category === 'side' ? 'right' : 'left';
}
