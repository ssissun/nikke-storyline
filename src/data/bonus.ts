import type { BonusCard } from './types';

/**
 * 메인 줄기와 무관하지만 단독 감상으로 호평인 이벤트
 * 순서: MIRACLE SNOW · 2X2 LOVE · BLANK TICKET · TERMINUS TICKET
 */
export const bonusCards: BonusCard[] = [
  {
    tag: '아카이브 O',
    title: 'MIRACLE SNOW',
    bullets: [
      '스토리 라인 미포함 이벤트 중 <strong>보통 1위로 꼽힘</strong>.',
      '감상 전 <em>N102 · 루피 호감도 스토리</em> 감상 권장.',
    ],
    related: { type: 'nikke', value: 'N102 · 루피' },
  },
  {
    tag: '아카이브 X',
    title: '2X2 LOVE',
    bullets: [
      '현재 <strong>아카이브 미포함</strong>.',
      '<strong>미연시</strong> 형식의 이벤트.',
      '감상 전 <em>아르카나 호감도 스토리</em> 감상 권장 (캐릭터 파악).',
    ],
    related: { type: 'nikke', value: '아르카나 · 프리바티' },
  },
  {
    tag: '아카이브 X',
    title: 'BLANK TICKET',
    bullets: [
      '현재 <strong>아카이브 미포함</strong>.',
      '후속 스토리는 <em>TERMINUS TICKET</em>.',
    ],
    related: { type: 'squad', value: '인피니티 레일' },
  },
  {
    tag: '아카이브 X',
    title: 'TERMINUS TICKET',
    bullets: [
      '현재 <strong>아카이브 미포함</strong>.',
      '<em>BLANK TICKET</em>의 후속 스토리.',
    ],
    related: { type: 'squad', value: '인피니티 레일' },
  },
];
