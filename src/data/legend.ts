import type { LegendCategory } from './types';

export const legendCategories: LegendCategory[] = [
  {
    category: 'main',
    label: '메인 스토리',
    description: 'Chapter 1 ~ 46. 본편 줄기. 모두 필수.',
  },
  {
    category: 'event',
    label: '이벤트 스토리',
    description: '주년 · 신년 스토리는 필수, 그 외에는 대부분 선택.',
  },
  {
    category: 'side',
    label: '사이드 스토리',
    description: '전부 필수. 인물 · 진영 보강이 본편 이해에 직결.',
  },
  {
    category: 'affinity',
    label: '호감도 스토리',
    description: '후속 이해에 도움. 필수 아님.',
  },
];
