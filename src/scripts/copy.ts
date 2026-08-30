const HOLD = 2000;

/** Copiar el email confirma en el mismo botón y vuelve solo. */
export function initCopy(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLElement>('[data-copy]').forEach((button) => {
    const value = button.dataset.copy;
    const label = button.querySelector<HTMLElement>('[data-copy-label]');
    if (!value || !label) return;

    const original = label.textContent ?? 'Copy';
    let timer: number | undefined;

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        // Sin permiso de portapapeles el mailto sigue siendo la vía válida.
        return;
      }

      label.textContent = 'Copied';
      button.dataset.copied = 'true';

      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        label.textContent = original;
        delete button.dataset.copied;
      }, HOLD);
    });
  });
}
