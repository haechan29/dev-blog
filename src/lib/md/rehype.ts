import type { Element, ElementContent, Node, Parent, Root } from 'hast';
import { defaultSchema, type Options } from 'rehype-sanitize';
import { visit } from 'unist-util-visit';

export const schema: Options = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      ['data-size', 'large', 'medium'],
      'data-caption',
    ],
    div: [
      ...(defaultSchema.attributes?.div ?? []),
      'data-bgm',
      'data-youtube-url',
      'data-start-time',
      'data-spacer',
      'data-lines',
    ],
  },
};

export function rehypeOffset() {
  return (tree: Root) => {
    visit(tree, (node: Node, index?: number, parent?: Parent) => {
      if (index === undefined || !parent) return;

      const startOffset = node.position?.start.offset;
      const endOffset = node.position?.end.offset;
      if (startOffset === undefined || endOffset === undefined) return;

      if (node.type === 'element') {
        const element = node as Element;
        element.properties['data-start-offset'] = `${startOffset}`;
        element.properties['data-end-offset'] = `${endOffset}`;
      } else {
        const spanElement: ElementContent = {
          type: 'element' as const,
          tagName: 'span',
          properties: {
            'data-start-offset': `${startOffset}`,
            'data-end-offset': `${endOffset}`,
          },
          children: [node as ElementContent],
          position: node.position,
        };
        parent.children[index] = spanElement;
      }
    });
  };
}

export function rehypeBgm() {
  return (tree: Root) => {
    visit(tree, 'element', (element: Element) => {
      if (element.tagName === 'div' && 'data-bgm' in element.properties) {
        element.tagName = 'bgm';
      }
    });
  };
}

export function rehypeSpacer() {
  return (tree: Root) => {
    visit(tree, 'element', (element: Element) => {
      if (element.tagName === 'div' && 'data-spacer' in element.properties) {
        element.tagName = 'spacer';
      }
    });
  };
}
