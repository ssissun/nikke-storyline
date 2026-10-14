import type { LegendCategory } from './types';

export const legendCategories: LegendCategory[] = [
  {
    category: 'main',
    label: '메인 스토리',
    description: '작전출격. 모두 필수',
  },
  {
    category: 'event',
    label: '이벤트 스토리',
    description: '로비 더보기 → 스토리라인 또는 커맨드센터 → 회상 → 아카이브',
  },
  {
    category: 'side',
    label: '사이드 스토리',
    description: '로비 더보기 → 스토리라인 또는 커맨드센터 → 사이드 스토리',
  },
  {
    category: 'affinity',
    label: '인연 스토리',
    description: '커맨드센터 → 상담',
  },
];
