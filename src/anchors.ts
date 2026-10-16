// 업데이트 로그에서 눌러 이동할 위치의 요소 id.
// 카드 · 묶음 · 노트 등을 렌더하는 컴포넌트와 업데이트 로그가 같은 규칙으로 만든다.
export type AnchorKind = 'story' | 'note' | 'bonus' | 'setting';

export const anchorId = (kind: AnchorKind, title: string) =>
  `${kind}-${title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')}`;
