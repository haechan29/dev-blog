import type { Element, ElementContent, Node, Parent, Root } from 'hast';
import { defaultSchema, type Options } from 'rehype-sanitize';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

type NodeStatus = {
  node: Node;
  index: number;
  parent: Parent;
};

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

export function rehypeCursor() {
  return (tree: Root, file: VFile) => {
    const cursorPosition = file.data.cursorPosition;
    if (typeof cursorPosition !== 'number') return;

    let minLength: number | null = null;
    let targetStatus: NodeStatus | null = null;

    visit(tree, (node: Node, index?: number, parent?: Parent) => {
      if (index === undefined || !parent) return;

      const nodeStart = node.position?.start.offset;
      const nodeEnd = node.position?.end.offset;
      if (nodeStart === undefined || nodeEnd === undefined) return;
      const length = nodeEnd - nodeStart;

      if (nodeStart < cursorPosition && cursorPosition <= nodeEnd) {
        if (minLength === null || length <= minLength) {
          minLength = length;
          targetStatus = { node, index, parent };
        }
      }
    });

    if (targetStatus === null) return;
    const { node, index, parent } = targetStatus as NodeStatus;
    if (node.type === 'element') {
      (node as Element).properties['data-has-cursor'] = '';
    } else {
      const spanElement: ElementContent = {
        type: 'element' as const,
        tagName: 'span',
        properties: {
          'data-has-cursor': '',
        },
        children: [node as ElementContent],
        position: node.position,
      };
      parent.children[index] = spanElement;
    }
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
