import type { Element } from 'hast';
import { defaultSchema, type Options } from 'rehype-sanitize';
import type { Node } from 'unist';
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

export function rehypeBgm() {
  return (tree: Node) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'div' && 'data-bgm' in node.properties) {
        node.tagName = 'bgm';
      }
    });
  };
}

export function rehypeSpacer() {
  return (tree: Node) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'div' && 'data-spacer' in node.properties) {
        node.tagName = 'spacer';
      }
    });
  };
}
