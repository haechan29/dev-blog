import { DialogueNode } from '@/types/mdast';
import { BgmNode, ImageWithCaptionNode, Root, SpacerNode, Text } from 'mdast';
import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from 'mdast-util-directive';
import { toString } from 'mdast-util-to-string';
import type { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

// unist Position requires line/column >= 1, but we only use offset values.
// Setting to 1 as a placeholder to satisfy the type requirement.
const UNUSED_LINE_COLUMN = 1;

const SUPERSCRIPT_MARKER = '^';
const SUBSCRIPT_MARKER = '~';
const INS_MARKER = '++';

type DirectiveNode = ContainerDirective | LeafDirective | TextDirective;

export function remarkInsPosition() {
  return createMarkerPositionPlugin('insert', INS_MARKER);
}

export function remarkSuperPosition() {
  return createMarkerPositionPlugin('superscript', SUPERSCRIPT_MARKER);
}

export function remarkSubPosition() {
  return createMarkerPositionPlugin('subscript', SUBSCRIPT_MARKER);
}

export function remarkTextPosition() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index?: number, parent?: Parent) => {
      if (index === undefined || !parent) return;
      if (node.position) return;

      const parentPosition = parent.position;
      if (!parentPosition) return;

      let startOffset: number;
      if (index === 0) {
        startOffset = parentPosition.start.offset!;
      } else {
        const prevSibling = parent.children[index - 1];
        if (!prevSibling.position?.end.offset) return;
        startOffset = prevSibling.position.end.offset;
      }

      let endOffset: number;
      if (index === parent.children.length - 1) {
        endOffset = parentPosition.end.offset!;
      } else {
        const nextSibling = parent.children[index + 1];
        if (!nextSibling.position?.start.offset) return;
        endOffset = nextSibling.position.start.offset;
      }

      node.position = {
        start: {
          line: UNUSED_LINE_COLUMN,
          column: UNUSED_LINE_COLUMN,
          offset: startOffset,
        },
        end: {
          line: UNUSED_LINE_COLUMN,
          column: UNUSED_LINE_COLUMN,
          offset: endOffset,
        },
      };
    });
  };
}

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
          const spacers: SpacerNode[] = [];

          for (let j = 0; j < spacerCount; j++) {
            const offsetStart = nodeEnd + 1 + j;
            const offsetEnd = offsetStart + 1;

            spacers.push({
              type: 'spacer',
              position: {
                start: {
                  line: UNUSED_LINE_COLUMN,
                  column: UNUSED_LINE_COLUMN,
                  offset: offsetStart,
                },
                end: {
                  line: UNUSED_LINE_COLUMN,
                  column: UNUSED_LINE_COLUMN,
                  offset: offsetEnd,
                },
              },
              data: {
                hName: 'spacer',
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

      const { url, alt, size, status } = node.attributes || {};
      if (!url) return;

      const caption = toString(node);
      visit(node, 'text', (textNode: Text) => {
        textNode.value = textNode.value
          .split(/(?<!\\)#/)
          .map(s => s.replace(/\\#/g, '#'))
          .filter(Boolean)
          .join('');
      });

      const validSize = size === 'medium' || size === 'large' ? size : 'medium';
      const validStatus =
        status === 'failed' || status === 'success' || status === 'loading'
          ? status
          : 'success';

      const newNode: ImageWithCaptionNode = {
        ...node,
        type: 'imageWithCaption',
        data: {
          hName: 'imageWithCaption',
          hProperties: {
            ...(node.data?.hProperties ?? {}),
            src: url,
            alt: alt ?? '',
            'data-size': validSize,
            'data-status': validStatus,
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

      const newNode: BgmNode = {
        ...node,
        type: 'bgm',
        data: {
          hName: 'bgm',
          hProperties: {
            'data-youtube-url': youtubeUrl,
            'data-start-time': startTime ?? '0',
          },
        },
      };

      parent.children[index] = newNode;
    });
  };
}

export function remarkDialogue() {
  return (tree: Root) => {
    visit(tree, (node: Node, index?: number, parent?: Parent) => {
      if (index === undefined || !parent) return;
      if (!isDirectiveNode(node) || node.name !== 'dialogue') return;

      const { speaker, avatar } = node.attributes || {};
      if (!speaker) return;

      const newNode: DialogueNode = {
        ...node,
        type: 'dialogue',
        data: {
          hName: 'dialogue',
          hProperties: {
            'data-speaker': speaker,
            ...(avatar && { 'data-avatar': avatar }),
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
          start: {
            line: UNUSED_LINE_COLUMN,
            column: UNUSED_LINE_COLUMN,
            offset: currentStart,
          },
          end: {
            line: UNUSED_LINE_COLUMN,
            column: UNUSED_LINE_COLUMN,
            offset: breakStart,
          },
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

function createMarkerPositionPlugin(
  nodeType: 'insert' | 'superscript' | 'subscript',
  marker: string
) {
  return (tree: Root, file: VFile) => {
    const source = String(file.value);
    const positions = findAllMarkerPositions(source, marker);

    let count = 0;
    visit(tree, nodeType, (node: Parent) => {
      const pos = positions[count++];
      if (!pos) return;

      node.position = {
        start: {
          line: UNUSED_LINE_COLUMN,
          column: UNUSED_LINE_COLUMN,
          offset: pos.start,
        },
        end: {
          line: UNUSED_LINE_COLUMN,
          column: UNUSED_LINE_COLUMN,
          offset: pos.end,
        },
      };

      fillChildrenPositions(node, pos.start + marker.length);
    });
  };
}

function findAllMarkerPositions(
  source: string,
  marker: string
): { start: number; end: number }[] {
  const positions: { start: number; end: number }[] = [];
  const markerLength = marker.length;
  let pos = 0;

  while (true) {
    const start = source.indexOf(marker, pos);
    if (start === -1) break;

    const end = source.indexOf(marker, start + markerLength);
    if (end === -1) break;

    positions.push({ start, end: end + markerLength });
    pos = end + markerLength;
  }

  return positions;
}

function fillChildrenPositions(node: Parent, startOffset: number) {
  let currentOffset = startOffset;

  for (const child of node.children) {
    if (child.position) {
      currentOffset = child.position.end.offset!;
      continue;
    }

    if (child.type === 'text' && 'value' in child) {
      const textNode = child as Text;
      const length = textNode.value.length;
      textNode.position = {
        start: {
          line: UNUSED_LINE_COLUMN,
          column: UNUSED_LINE_COLUMN,
          offset: currentOffset,
        },
        end: {
          line: UNUSED_LINE_COLUMN,
          column: UNUSED_LINE_COLUMN,
          offset: currentOffset + length,
        },
      };
      currentOffset += length;
    }
  }
}
