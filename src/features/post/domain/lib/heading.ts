import Heading from '@/features/post/domain/model/heading';

export function findHeadingByScroll() {
  const postContent = document.querySelector('[data-post-content]');
  if (!postContent) return;

  const positionMap = new Map<Heading, number>();
  const headingElements = postContent.querySelectorAll(
    'h1, h2, h3, h4, h5, h6'
  );
  (Array.from(headingElements) as HTMLElement[]).forEach(element => {
    const heading: Heading = {
      id: element.id,
      text: element.textContent || '',
      level: parseInt(element.tagName.substring(1)),
    };
    positionMap.set(heading, element.offsetTop);
  });

  const vh = window.innerHeight;
  const threshold = 0.1 * vh;

  const headingElementsInVisibleArea = [...positionMap]
    .filter(([, position]) => Math.abs(position - window.scrollY) < threshold)
    .map(([heading]) => heading);

  if (headingElementsInVisibleArea.length > 0) {
    return headingElementsInVisibleArea[0];
  }

  const allHeadingElementsAbove = [...positionMap]
    .filter(([, position]) => position < window.scrollY - threshold)
    .map(([heading]) => heading);

  if (allHeadingElementsAbove.length > 0) {
    return allHeadingElementsAbove[allHeadingElementsAbove.length - 1];
  }

  return;
}
