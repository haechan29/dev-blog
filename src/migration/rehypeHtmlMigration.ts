import type { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';

export function rehypeInsToU() {
  return (tree: Root) => {
    visit(tree, 'element', (element: Element) => {
      if (element.tagName === 'ins') {
        element.tagName = 'u';
      }
    });
  };
}
