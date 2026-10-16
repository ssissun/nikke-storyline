// 모달 창(dialog)을 닫을 때 사라지는 애니메이션을 보여 준 뒤 실제로 닫는다.
// 열릴 때 애니메이션은 CSS(.motion-dialog[open])가 맡는다.
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const pending = new WeakMap<HTMLDialogElement, () => void>();

// 다 닫힌 뒤에 풀리는 Promise. 닫힐 때 브라우저가 여는 버튼으로 포커스를 되돌리므로
// 닫은 다음 다른 곳으로 스크롤하려면 이것을 기다린다.
export const closeDialog = (dialog: HTMLDialogElement) =>
  new Promise<void>((resolve) => {
    if (!dialog.open) return resolve();
    if (reduceMotion()) {
      dialog.close();
      return resolve();
    }
    const previous = pending.get(dialog);
    pending.set(dialog, () => {
      previous?.();
      resolve();
    });
    dialog.classList.add('is-closing');
  });

// Esc · 닫기 버튼([data-dialog-close])도 애니메이션을 거쳐 닫히게 한다
export const bindDialogMotion = (dialog: HTMLDialogElement) => {
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDialog(dialog);
  });
  dialog.addEventListener('click', (event) => {
    if ((event.target as Element).closest('[data-dialog-close]')) closeDialog(dialog);
  });
  dialog.addEventListener('animationend', (event) => {
    // 창 안쪽 요소의 애니메이션 종료는 무시한다
    if (event.target !== dialog || !dialog.classList.contains('is-closing')) return;
    dialog.classList.remove('is-closing');
    dialog.close();
    pending.get(dialog)?.();
    pending.delete(dialog);
  });
};
