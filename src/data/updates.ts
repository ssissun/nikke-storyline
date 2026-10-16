import type { UpdateLogEntry } from './types';

/**
 * 업데이트 로그. 최신 날짜가 맨 위.
 * 페이지 상단 한 줄(맨 위 날짜의 첫 줄)과 업데이트 로그 창에 쓰이고,
 * 최종 갱신일(LAST_UPDATED)도 맨 위 날짜를 따른다.
 * 한 줄은 `[분류] 대상 · 변경` 형식으로 짧게 쓴다. 예) [이벤트] D.ARK HERO · 중요도 중간 → 높음
 * 화면의 특정 카드를 가리키는 줄은 { text, to: '카드 제목' }으로 쓰면 눌렀을 때 그 위치로 이동한다.
 */
export const updates: UpdateLogEntry[] = [
  {
    date: '2026-10-16',
    items: [
      '[기능] 스토리라인 필터 추가',
      '[기능] 업데이트 로그 추가',
      '[기능] 스포일러 가리기 추가',
      '[디자인] 스토리 썸네일 추가',
      '[디자인] 주년 · 신년 카드 강조',
      { text: '[스토리라인 밖] 블라블라 → 세르반 추가', to: '블라블라 → 세르반' },
      '[스토리라인 밖] 전초기지(지하 1층) · 방주(지하 2층) 삭제',
      '[스토리라인 밖] 섹션 이름 외부 분기 → 스토리라인 밖에서 챙길 스토리',
      { text: '[메인] Chapter 1 — 14 → Chapter 0 — 14, 설명 수정', to: 'Chapter 0 — 14' },
      '[설명] 타임라인 2곳 수정',
    ],
  },
  {
    date: '2026-10-15',
    items: [
      '[기능] 가이드 데이터 JSON 공개',
      '[디자인] 라이트 테마 변경',
      { text: '[이벤트] D.ARK HERO · 중요도 중간 → 높음', to: 'D.ARK HERO' },
      '[설명] 범례 수정',
    ],
  },
  {
    date: '2026-10-14',
    items: [
      '[디자인] 파비콘 추가',
      '[디자인] 설정 스토리 카드 형태 변경',
      "[타임라인] '선택 감상 이벤트 스토리' 묶음 해체",
      {
        text: "[이벤트] DIRTY BACKYARD, BOOM'S DAY, D.ARK HERO · 개별 카드로 분리",
        to: 'DIRTY BACKYARD',
      },
      '[이벤트] L.T.K — LICENSE TO KILL, KILL THE LORD 삭제',
      {
        text: '[호평 이벤트] ICE DRAGON SAGA · 타임라인 → 호평 이벤트 이동',
        to: 'ICE DRAGON SAGA',
      },
      { text: '[이벤트] GOOD WORLD · 선택 → 필수, 설명 추가', to: 'GOOD WORLD' },
      '[용어정리] 호감도 스토리 → 인연 스토리',
      { text: '[설정 스토리] 퍼펙트 → 퍼펙트(방주 식량)', to: '퍼펙트(방주 식량)' },
      '[설명] 타임라인 5곳, 먼저 알아둘 점, 범례, 외부 분기, 호평 이벤트 수정',
    ],
  },
  {
    date: '2026-10-10',
    items: [
      {
        text: '[메인] OLD TALES · ROUTE 3 ↔ 4 번호 변경, 설명 수정',
        to: 'Chapter 31 — 32 · OLD TALES',
      },
    ],
  },
  {
    date: '2026-10-09',
    items: [
      { text: '[사이드] GINGERBREAD HOUSE 추가', to: 'GINGERBREAD HOUSE' },
      {
        text: '[메인] OLD TALES · ROUTE 3 ↔ 4 순서 변경, 설명 수정',
        to: 'Chapter 31 — 32 · OLD TALES',
      },
      '[설명] 타임라인 4곳, 설정 스토리 수정',
    ],
  },
  {
    date: '2026-10-06',
    items: [{ text: '[이벤트] COIN RUSH SHOWDOWN · 설명 추가', to: 'COIN RUSH SHOWDOWN' }],
  },
  {
    date: '2026-10-04',
    items: [{ text: '[이벤트] COIN RUSH SHOWDOWN 추가', to: 'COIN RUSH SHOWDOWN' }],
  },
  {
    date: '2026-09-23',
    items: [
      {
        text: '[메인] Chapter 1 — 20 → Chapter 1 — 14 / Chapter 15 — 20 분할',
        to: 'Chapter 0 — 14',
      },
      {
        text: '[사이드] SECOND AFFECTION · 위치 이동 (Chapter 1 — 14 다음), 설명 수정',
        to: 'SECOND AFFECTION',
      },
      {
        text: '[이벤트] FIRST AFFECTION · 위치 이동 (SECOND AFFECTION 다음), 설명 수정',
        to: 'FIRST AFFECTION',
      },
      '[인연 스토리] 디젤 삭제',
      {
        text: '[이벤트] OVER THE HORIZON · 필수 → 선택 (중요도 중간)',
        to: 'OVER THE HORIZON',
      },
      '[타임라인] 선택적 감상 이벤트 스토리 → 선택 감상 이벤트 스토리, 설명 수정',
      '[설명] 타임라인 11곳 수정',
    ],
  },
  {
    date: '2026-08-19',
    items: [
      { text: '[메인] Chapter 47 — 48 추가', to: 'Chapter 47 — 48' },
      {
        text: "[타임라인] '출시되는 이벤스의 메인스 연관성이 높아지는 기점' 안내 추가",
        to: '출시되는 이벤스의 메인스 연관성이 높아지는 기점',
      },
      { text: '[이벤트] OVER THE HORIZON · 선택 → 필수, 설명 수정', to: 'OVER THE HORIZON' },
      { text: '[설정 스토리] 지휘관 → 지휘관(주인공)', to: '지휘관(주인공)' },
      '[설명] 타임라인 5곳, 호평 이벤트 수정',
    ],
  },
];
