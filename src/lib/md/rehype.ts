import type { Element, ElementContent, Node, Parent, Root } from 'hast';
import { defaultSchema, type Options } from 'rehype-sanitize';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

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
      ['data-tag-name', 'bgm', 'spacer'],
      'data-youtube-url',
      'data-start-time',
      'data-lines',
    ],
  },
  protocols: {
    ...defaultSchema.protocols,
    src: [...(defaultSchema.protocols?.src ?? []), 'blob'],
  },
};

export function rehypeStyle() {
  return (tree: Root) => {
    visit(tree, 'element', (element: Element) => {
      if (
        element.properties?.style &&
        typeof element.properties.style === 'string'
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (element.properties as any).style = parseStyleString(
          element.properties.style
        );
      }
    });
  };
}

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

export function rehypeMode() {
  return (tree: Root, file: VFile) => {
    const mode = file.data.mode;
    if (typeof mode !== 'string') return;
    visit(tree, 'element', (element: Element) => {
      element.properties['data-mode'] = `${mode}`;
    });
  };
}

export function rehypeTagName() {
  return (tree: Root) => {
    visit(tree, 'element', (element: Element) => {
      if (element.tagName === 'div' && 'data-tag-name' in element.properties) {
        element.tagName = element.properties['data-tag-name'] as string;
      }
    });
  };
}

function parseStyleString(styleString: string): Record<string, string> {
  const styles: Record<string, string> = {};

  styleString.split(';').forEach(rule => {
    const [property, value] = rule.split(':').map(s => s.trim());
    if (property && value) {
      const camelProperty = property.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );
      styles[camelProperty] = value;
    }
  });

  return styles;
}
