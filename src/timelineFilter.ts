import type { OldTalesGroup, StoryCard } from './data/types';

// 스토리라인 필터가 읽는 data-* 속성. TimelineFilter.astro의 스크립트와 짝을 이룬다.
// - rank: 필수 3 · 중요도 높음 2 · 중간 1 · 낮음 0
// - kinds: main · anniv(주년 · 신년) · side · event(일반 이벤트) · affinity 중 해당하는 것
// - dub: y(더빙 O) · n(더빙 X)
const IMPORTANCE_RANK = { high: 2, medium: 1, low: 0 } as const;

export const cardFilterAttrs = (card: StoryCard) => {
  const kinds: string[] =
    card.category === 'event' ? [card.anniversary ? 'anniv' : 'event'] : [card.category];
  if (card.anniversary && card.category !== 'event') kinds.push('anniv');
  return {
    'data-filter-item': '',
    'data-rank': card.required ? 3 : IMPORTANCE_RANK[card.importance ?? 'low'],
    'data-kinds': kinds.join(' '),
    'data-dub': card.noDub ? 'n' : 'y',
  };
};

// OLD TALES 묶음: 메인 + 이벤트, 항상 필수
export const oldTalesFilterAttrs = (group: OldTalesGroup) => ({
  'data-filter-item': '',
  'data-rank': 3,
  'data-kinds': ['main', group.anniversary ? 'anniv' : 'event'].join(' '),
  'data-dub': 'y',
});
