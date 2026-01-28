export function scrollToCaretIfNeeded(editor: HTMLTextAreaElement) {
  const caretTop = getCaretOffsetTop(editor);
  const scrollTop = editor.scrollTop;
  const editorHeight = editor.clientHeight;

  const isCaretVisible =
    caretTop >= scrollTop && caretTop <= scrollTop + editorHeight;

  if (!isCaretVisible) {
    editor.scrollTo({
      top: caretTop - editorHeight / 2,
      behavior: 'smooth',
    });
  }
}

export function getCaretOffsetTop(textarea: HTMLTextAreaElement): number {
  const mirror = document.createElement('div');
  const style = getComputedStyle(textarea);

  const properties = [
    'fontFamily',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'width',
    'overflowWrap',
    'wordWrap',
    'wordBreak',
    'boxSizing',
  ] as const;

  properties.forEach(prop => {
    mirror.style[prop] = style[prop];
  });

  mirror.style.position = 'absolute';
  mirror.style.visibility = 'hidden';
  mirror.style.whiteSpace = 'pre-wrap';

  mirror.textContent = textarea.value.substring(0, textarea.selectionStart);

  const marker = document.createElement('span');
  marker.textContent = '\u200b'; // zero-width space
  mirror.appendChild(marker);

  document.body.appendChild(mirror);

  const caretTop = marker.offsetTop;

  document.body.removeChild(mirror);

  return caretTop;
}
