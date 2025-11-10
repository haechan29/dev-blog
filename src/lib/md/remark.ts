import { Paragraph, PhrasingContent, Root } from 'mdast';
import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from 'mdast-util-directive';
import type { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

type DirectiveNode = ContainerDirective | LeafDirective | TextDirective;

export function remarkTextBreaks() {
  return (tree: Root, file: VFile) => {
    const source = String(file.value);
    const lineBreaks = findLineBreaks(source);
    let lineBreakIndex = 0;

    visit(tree, 'paragraph', (paragraph: Paragraph) => {
      const newChildren: PhrasingContent[] = [];
      paragraph.children.forEach(child => {
        if (child.type === 'text') {
          const { start: positionStart, end: positionEnd } = child.position!;
          const nodeStart = positionStart!.offset!;
          const nodeEnd = positionEnd!.offset!;
          const currentLineBreaks: [number, number][] = [];

          while (lineBreakIndex < lineBreaks.length) {
            const [breakStart, breakCount] = lineBreaks[lineBreakIndex];
            if (breakStart >= nodeEnd) break;
            if (breakStart > nodeStart) {
              currentLineBreaks.push([breakStart, breakCount]);
            }
            lineBreakIndex++;
          }
          currentLineBreaks.unshift([nodeStart, 0]);
          currentLineBreaks.push([nodeEnd, 0]);

          for (let i = 0; i + 1 < currentLineBreaks.length; i++) {
            const [prevBreakStart, prevBreakCount] = currentLineBreaks[i];
            const [nextBreakStart, nextBreakCount] = currentLineBreaks[i + 1];
            const textStart = prevBreakStart + prevBreakCount;
            const textEnd = nextBreakStart;
            const value = source.slice(textStart, textEnd);
            if (value)
              newChildren.push({
                type: 'text',
                value,
                position: {
                  start: { ...positionStart, offset: textStart },
                  end: { ...positionEnd, offset: textEnd },
                },
              });
            for (let j = 0; j < nextBreakCount; j++) {
              newChildren.push({ type: 'break' });
            }
          }
        } else {
          newChildren.push(child);
        }
      });
      paragraph.children = newChildren;
    });
  };
}

export function remarkSpacer() {
  return (tree: Root, file: VFile) => {
    const source = String(file.value);
    const lineBreaks = findLineBreaks(source);
    let lineBreakIndex = lineBreaks.length - 1;

    for (let i = tree.children.length - 1; i >= 0; i--) {
      const child = tree.children[i];
      const { start: positionStart, end: positionEnd } = child.position!;
      const nodeEnd = positionEnd.offset!;

      while (lineBreakIndex >= 0) {
        const [breakStart, breakCount] = lineBreaks[lineBreakIndex];
        if (breakStart < nodeEnd) break;
        if (breakStart === nodeEnd && breakCount >= 2) {
          tree.children.splice(i + 1, 0, {
            type: 'spacer',
            position: {
              start: { ...positionStart, offset: nodeEnd + 1 },
              end: { ...positionEnd, offset: nodeEnd + breakCount - 1 },
            },
            data: {
              hProperties: {
                'data-spacer': '',
                'data-lines': `${breakCount - 1}`,
              },
            },
          });
        }
        lineBreakIndex--;
      }
    }
  };
}

export function remarkImg() {
  return (tree: Root) => {
    visit(tree, (node: Node, index?: number, parent?: Parent) => {
      if (index === undefined || !parent) return;
      if (!isDirectiveNode(node) || node.name !== 'img') return;

      const { url, alt = '', size = 'medium' } = node.attributes || {};
      if (!url) return;

      const caption = node.children
        .filter(child => child.type === 'paragraph')
        .map(p =>
          p.children
            .map(child => {
              if (child.type === 'text') return child.value;
              if (child.type === 'break') return '\n';
              return '';
            })
            .join('')
        )
        .join('\n');

      const newNode = {
        type: 'image',
        url,
        alt,
        data: {
          hProperties: {
            'data-size': size,
            'data-caption': caption,
          },
        },
      };
      parent.children[index] = newNode;
    });
  };
}

export function remarkBgm() {
  return (tree: Root) => {
    visit(tree, (node: Node, index?: number, parent?: Parent) => {
      if (index === undefined || !parent) return;
      if (!isDirectiveNode(node) || node.name !== 'bgm') return;

      const { youtubeUrl, startTime } = node.attributes || {};
      if (!youtubeUrl) return;

      const newNode = {
        type: 'bgm',
        data: {
          hProperties: {
            'data-bgm': '',
            'data-youtube-url': youtubeUrl,
            'data-start-time': startTime ?? '0',
          },
        },
      };

      parent.children[index] = newNode;
    });
  };
}

function findLineBreaks(str: string): [number, number][] {
  const result: [number, number][] = [];
  const regex = /\n+/g;
  let match;

  while ((match = regex.exec(str)) !== null) {
    const startIndex = match.index;
    const count = match[0].length;
    result.push([startIndex, count]);
  }

  return result;
}

function isDirectiveNode(node: Node): node is DirectiveNode {
  return (
    node.type === 'containerDirective' ||
    node.type === 'leafDirective' ||
    node.type === 'textDirective'
  );
}
