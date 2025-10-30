import type { Element } from 'hast';
import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from 'mdast-util-directive';
import { defaultSchema, type Options } from 'rehype-sanitize';
import type { Node } from 'unist';
import { visit } from 'unist-util-visit';

type HtmlElement = {
  name: string;
  properties: {
    className?: string;
    id?: string;
    style?: string;
  };
};

type DirectiveNode = ContainerDirective | LeafDirective | TextDirective;

const customElements: Record<string, HtmlElement> = {
  paged: { name: 'div', properties: { className: 'paged' } },
  caption: { name: 'div', properties: { className: 'caption' } },
  hidefullscreen: { name: 'div', properties: { className: 'hide-fullscreen' } },
};

export const schema: Options = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      ['className', 'w-full', 'min-w-56 w-1/2'],
    ],
  },
};

export function remarkCustomDirectives() {
  return (tree: Node) => {
    visit(tree, node => {
      if (!isDirectiveNode(node)) return;
      if (customElements[node.name]) {
        const { name, properties } = customElements[node.name];
        node.data = {
          hName: name,
          hProperties: properties,
        };
      }
    });
  };
}

export function rehypeLink() {
  return (tree: Node) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'a' && node.properties?.href) {
        const href = node.properties.href as string;
        if (href.startsWith('http') || href.startsWith('//')) {
          node.properties.rel = 'noopener noreferrer';
          node.properties.target = '_blank';
        }
      }
    });
  };
}

/**
 * rehype plugin that wraps images with container div and adds unique IDs
 */
export function rehypeImage() {
  return (tree: Node) => {
    let imageCounter = 0;
    visit(tree, 'element', (node: Element, index: number, parent: Element) => {
      if (node.tagName === 'img') {
        const wrapper: Element = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: 'image-wrapper w-fit relative',
          },
          children: [
            {
              ...node,
              properties: {
                ...node.properties,
                id: `img-${imageCounter++}`,
              },
            },
          ],
        };
        parent.children[index] = wrapper;
      }
    });
  };
}

function isDirectiveNode(node: Node): node is DirectiveNode {
  return (
    node.type === 'containerDirective' ||
    node.type === 'leafDirective' ||
    node.type === 'textDirective'
  );
}
