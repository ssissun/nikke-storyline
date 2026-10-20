// 감상 완료 기록. 방문자 브라우저(localStorage)에만 저장하고 어디로도 보내지 않는다.
// 카드 id(anchors.ts) 목록을 저장하므로, 카드 제목이 바뀌면 그 카드의 기록은 사라진다.
const STORAGE_KEY = 'nikke-watched';

export const WATCHED_CHANGE = 'watched:change'; // 기록이 바뀌면 document에 보내는 이벤트

// 진행률에서 카드 하나가 차지하는 몫. 메인 스토리는 챕터 하나를 1로 센다:
// 'Chapter 0 — 14' → 15, 'Chapter 31 — 32 · OLD TALES' → 챕터 2 + OLD TALES 1 = 3, 그 밖의 카드는 1
export const watchWeight = (title: string) => {
  const range = title.match(/^Chapter (\d+)\s*—\s*(\d+)/);
  if (!range) return 1;
  const chapters = Number(range[2]) - Number(range[1]) + 1;
  return title.includes('·') ? chapters + 1 : chapters;
};

export const loadWatched = (): Set<string> => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return new Set(Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : []);
  } catch {
    return new Set(); // 저장소를 못 쓰는 환경(사생활 보호 모드 등)에서는 이번 방문 동안만 기억한다
  }
};

export const saveWatched = (watched: Set<string>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...watched]));
  } catch {
    // 저장 실패는 무시한다
  }
};
