import { Root, RootContent, Text } from 'mdast';
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

    visit(tree, 'text', (node: Text, index?: number, parent?: Parent) => {
      if (index === undefined || !parent) return;

      const newNodes = splitTextByLineBreaks(node, source, lineBreaks);

      if (newNodes.length === 1 && newNodes[0] === node) return;

      parent.children.splice(index, 1, ...newNodes);
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
      const { end: positionEnd } = child.position!;
      const nodeEnd = positionEnd.offset!;

      while (lineBreakIndex >= 0) {
        const [breakStart, breakCount] = lineBreaks[lineBreakIndex];
        if (breakStart < nodeEnd) break;

        if (breakStart === nodeEnd && breakCount >= 2) {
          const spacerCount = breakCount - 1;
          const spacers: RootContent[] = [];

          for (let j = 0; j < spacerCount; j++) {
            const offsetStart = nodeEnd + 1 + j;
            const offsetEnd = offsetStart + 1;

            spacers.push({
              type: 'spacer',
              position: {
                start: { line: 0, column: 0, offset: offsetStart },
                end: { line: 0, column: 0, offset: offsetEnd },
              },
              data: {
                hProperties: {
                  'data-tag-name': 'spacer',
                },
              },
            });
          }

          tree.children.splice(i + 1, 0, ...spacers);
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

      const { url, alt = '', size = 'medium', status } = node.attributes || {};
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
        ...node,
        type: 'image',
        url,
        alt,
        data: {
          hProperties: {
            ...(node.data?.hProperties ?? {}),
            'data-size': size,
            'data-caption': caption,
            ...(status && { 'data-status': status }),
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
        ...node,
        type: 'bgm',
        data: {
          hProperties: {
            'data-tag-name': 'bgm',
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

function splitTextByLineBreaks(
  node: Text,
  source: string,
  lineBreaks: [number, number][]
): (Text | { type: 'break' })[] {
  const nodeStart = node.position?.start?.offset;
  const nodeEnd = node.position?.end?.offset;
  if (nodeStart === undefined || nodeEnd === undefined) {
    return [node];
  }

  const relevantBreaks = lineBreaks.filter(
    ([breakStart]) => breakStart >= nodeStart && breakStart < nodeEnd
  );

  if (relevantBreaks.length === 0) {
    return [node];
  }

  const result: (Text | { type: 'break' })[] = [];
  let currentStart = nodeStart;

  for (const [breakStart, breakCount] of relevantBreaks) {
    const textValue = source.slice(currentStart, breakStart);
    if (textValue) {
      result.push({
        type: 'text',
        value: textValue,
        position: {
          start: { ...node.position!.start, offset: currentStart },
          end: { ...node.position!.end, offset: breakStart },
        },
      });
    }

    for (let i = 0; i < breakCount; i++) {
      result.push({ type: 'break' });
    }

    currentStart = breakStart + breakCount;
  }

  const lastText = source.slice(currentStart, nodeEnd);
  if (lastText) {
    result.push({
      type: 'text',
      value: lastText,
      position: {
        start: { ...node.position!.start, offset: currentStart },
        end: { ...node.position!.end, offset: nodeEnd },
      },
    });
  }

  return result;
}
