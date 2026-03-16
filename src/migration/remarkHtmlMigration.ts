import { Root } from 'mdast';
import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from 'mdast-util-directive';
import type { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

type DirectiveNode = ContainerDirective | LeafDirective | TextDirective;

function isDirectiveNode(node: Node): node is DirectiveNode {
  return (
    node.type === 'containerDirective' ||
    node.type === 'leafDirective' ||
    node.type === 'textDirective'
  );
}

export function remarkImgHtmlMigration() {
  return (tree: Node) => {
    visit(
      tree,
      (node: Node, index: number | undefined, parent: Parent | undefined) => {
        if (
          !isDirectiveNode(node) ||
          node.name !== 'img' ||
          !parent ||
          index === undefined
        ) {
          return;
        }

        if (node.data && (node.data as { hName?: string }).hName === 'figure') {
          return;
        }

        const { url, alt, size, status, id } = node.attributes || {};
        if (!url) return;

        const validSize =
          size === 'medium' || size === 'large' ? size : 'medium';
        const validStatus =
          status === 'loading' || status === 'failed' || status === 'success'
            ? status
            : 'success';

        const figureNode: DirectiveNode = {
          ...(node as DirectiveNode),
          children: [],
          data: {
            ...(node.data ?? {}),
            hName: 'figure',
            hProperties: {
              ...(node.data?.hProperties ?? {}),
              'data-image-with-caption': '',
              'data-size': validSize,
              'data-status': validStatus,
              ...(id ? { 'data-id': id } : {}),
            },
            hChildren: [
              {
                type: 'element',
                tagName: 'img',
                properties: {
                  src: url,
                  alt: alt ?? '',
                },
                children: [],
              },
              {
                type: 'element',
                tagName: 'figcaption',
                properties: {},
                children: alt
                  ? [
                      {
                        type: 'text',
                        value: alt,
                      },
                    ]
                  : [],
              },
            ],
          },
        };

        parent.children.splice(
          index,
          1,
          figureNode,
          ...((node as DirectiveNode).children ?? [])
        );

        return index + 1;
      }
    );
  };
}

export function remarkRemoveBgm() {
  return (tree: Root) => {
    visit(tree, (node: Node, index?: number, parent?: Parent) => {
      if (index === undefined || !parent) return;

      if (isDirectiveNode(node) && node.name === 'bgm') {
        parent.children.splice(index, 1);
        return index;
      }

      if (node.type === 'bgm') {
        parent.children.splice(index, 1);
        return index;
      }
    });
  };
}

export function remarkDialogueHtmlMigration() {
  return (tree: Node) => {
    visit(tree, (node: Node) => {
      if (!isDirectiveNode(node) || node.name !== 'dialogue') return;

      const { speaker, avatar } = node.attributes || {};
      if (!speaker) return;

      node.data = {
        ...(node.data ?? {}),
        hName: 'div',
        hProperties: {
          ...(node.data?.hProperties ?? {}),
          'data-dialogue': '',
          'data-speaker': speaker,
          ...(avatar ? { 'data-avatar': avatar } : {}),
        },
      };
    });
  };
}

export function remarkSpacerHtmlMigration() {
  return (tree: Node) => {
    visit(
      tree,
      'spacer',
      (node: Node, index: number | undefined, parent: Parent | undefined) => {
        if (!parent || index === undefined) return;

        const paragraphNode: Node = {
          type: 'paragraph',
          position: node.position,
          children: [
            {
              type: 'break',
              position: node.position,
            },
          ],
        };

        parent.children.splice(index, 1, paragraphNode);
      }
    );
  };
}
