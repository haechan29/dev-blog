export function scrollToElement(
  element: Element,
  options?: boolean | ScrollIntoViewOptions,
  callback?: () => void
) {
  if (!callback) {
    element.scrollIntoView(options);
    return;
  }
  if (typeof window === 'undefined') return;

  let timer: NodeJS.Timeout;
  const handleScroll = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback();
      window.removeEventListener('scroll', handleScroll);
    }, 100);
  };
  window.addEventListener('scroll', handleScroll);
  element.scrollIntoView(options);
}
