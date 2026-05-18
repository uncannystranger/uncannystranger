import { useEffect } from 'react';

const isEditableTarget = (target: EventTarget | null) => {
  const element = target instanceof HTMLElement ? target : null;
  if (!element) return false;
  return (
    element.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)
  );
};

const isProtectedTarget = (target: EventTarget | null) =>
  target instanceof Element && Boolean(target.closest('[data-protected="true"]'));

const selectionIsProtected = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;
  const node = selection.anchorNode;
  const element =
    node instanceof Element ? node : node?.parentElement;
  return Boolean(element?.closest('[data-protected="true"]'));
};

export const useContentProtection = () => {
  useEffect(() => {
    if (!import.meta.env.PROD) return;

    console.info(
      '© Uncanny Stranger. All photography and visual content on this site is protected. Unauthorized copying, downloading, redistribution, or commercial use is prohibited.'
    );

    const preventProtectedAction = (event: Event) => {
      if (!isProtectedTarget(event.target)) return;
      event.preventDefault();
    };

    const preventProtectedCopy = (event: ClipboardEvent) => {
      if (!isProtectedTarget(event.target) && !selectionIsProtected()) return;
      event.preventDefault();
    };

    const preventShortcut = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      const key = event.key.toLowerCase();
      const modifier = event.metaKey || event.ctrlKey;
      const protectedCopy = modifier && key === 'c' && selectionIsProtected();
      const savePage = modifier && key === 's';
      const viewSource = modifier && key === 'u';
      const devtools =
        event.key === 'F12' ||
        (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key)) ||
        (event.metaKey && event.altKey && ['i', 'j', 'c'].includes(key));

      if (protectedCopy || savePage || viewSource || devtools) {
        event.preventDefault();
      }
    };

    document.addEventListener('contextmenu', preventProtectedAction);
    document.addEventListener('dragstart', preventProtectedAction);
    document.addEventListener('selectstart', preventProtectedAction);
    document.addEventListener('copy', preventProtectedCopy);
    document.addEventListener('cut', preventProtectedCopy);
    document.addEventListener('keydown', preventShortcut);

    return () => {
      document.removeEventListener('contextmenu', preventProtectedAction);
      document.removeEventListener('dragstart', preventProtectedAction);
      document.removeEventListener('selectstart', preventProtectedAction);
      document.removeEventListener('copy', preventProtectedCopy);
      document.removeEventListener('cut', preventProtectedCopy);
      document.removeEventListener('keydown', preventShortcut);
    };
  }, []);
};
