// 페이지 안의 카드 · 노트로 스크롤해 가고 잠깐 빛나게 한다(업데이트 로그 · 챕터 바로가기 공용).
// 스토리라인 필터에 가려진 카드면 필터를 풀고 이동한다.
const FLASH_MS = 1800;

const scrollAndFlash = (target: HTMLElement) => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  target.classList.remove('jump-flash');
  void target.offsetWidth; // 같은 카드를 연달아 눌러도 다시 깜빡이도록
  target.classList.add('jump-flash');
  window.setTimeout(() => target.classList.remove('jump-flash'), FLASH_MS);
};

export const jumpTo = (id: string) => {
  const target = document.getElementById(id);
  if (!target) return;
  if (target.closest('[hidden]')) {
    document.querySelector<HTMLFormElement>('[data-timeline-filter]')?.reset();
    window.setTimeout(() => scrollAndFlash(target)); // reset은 다음 틱에 반영된다
  } else {
    scrollAndFlash(target);
  }
};
