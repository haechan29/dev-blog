'use client';

import { writePostContentButtons } from '@/features/write/domain/model/writePostContentButton';
import useWritePostForm from '@/features/write/hooks/useWritePostForm';
import {
  createProps,
  DirectiveButtonProps,
  MarkdownButtonProps,
  TableButtonProps,
  WritePostContentButtonProps,
} from '@/features/write/ui/writePostContentButtonProps';
import { AppDispatch } from '@/lib/redux/store';
import { setContent } from '@/lib/redux/write/writePostFormSlice';
import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

const IMAGE_DIRECTIVE_PATTERN = ':::img[\\s\\S]*?:::';
const BGM_DIRECTIVE_PATTERN = '::bgm\\{[^}]*\\}';
const CURSOR_MARKER = '__NEW_CURSOR_POSITION__';

export default function useWritePostContentButton({
  contentEditorRef,
}: {
  contentEditorRef: RefObject<HTMLTextAreaElement | null>;
}) {
  const {
    writePostForm: {
      content: { value: content },
    },
  } = useWritePostForm();
  const dispatch = useDispatch<AppDispatch>();
  const [contentButtons] = useState(writePostContentButtons);
  const [activeType, setActiveType] = useState('markdown');
  const contentButtonProps = useMemo(() => {
    return contentButtons.map(createProps);
  }, [contentButtons]);

  const handleMarkdownAction = useCallback(
    ({ isBlock, markdownBefore, markdownAfter = '' }: MarkdownButtonProps) => {
      if (!contentEditorRef.current) return;
      const contentEditor = contentEditorRef.current;

      const { selectionStart, selectionEnd } = contentEditor;
      const [textBefore, selectedText, textAfter] = [
        content.substring(0, selectionStart),
        content.substring(selectionStart, selectionEnd),
        content.substring(selectionEnd),
      ];

      const shouldBreakBefore =
        isBlock && textBefore.trim() && !textBefore.endsWith('\n');
      const shouldBreakAfter = isBlock && !textAfter.startsWith('\n');
      const newText =
        textBefore +
        (shouldBreakBefore ? '\n' : '') +
        markdownBefore +
        selectedText +
        CURSOR_MARKER +
        markdownAfter +
        (shouldBreakAfter ? '\n' : '') +
        textAfter;

      const newCursorPosition = newText.indexOf(CURSOR_MARKER);
      const finalText = newText.replace(CURSOR_MARKER, '');
      const finalCursorPosition =
        newCursorPosition === -1 ? selectionStart : newCursorPosition;

      dispatch(setContent(finalText));
      setTimeout(() => {
        contentEditor.focus();
        contentEditor.setSelectionRange(
          finalCursorPosition,
          finalCursorPosition
        );
      }, 0);
    },
    [content, contentEditorRef, dispatch]
  );

  const handleDirectiveAction = useCallback(
    ({ type, position, key, value }: DirectiveButtonProps) => {
      if (!contentEditorRef.current) return;
      const contentEditor = contentEditorRef.current;
      const { selectionStart, selectionEnd, value: content } = contentEditor;
      const ranges = parseDirectiveRanges(content, type);

      const range = ranges.find(([directiveStart, directiveEnd]) => {
        return selectionStart >= directiveStart && selectionEnd <= directiveEnd;
      });
      if (!range) return;
      const [rangeStart, rangeEnd] = range;
      const [textBefore, directiveText, textAfter] = [
        content.substring(0, rangeStart),
        content.substring(rangeStart, rangeEnd),
        content.substring(rangeEnd),
      ];

      let newText = '';
      if (position === 'attribute') {
        const attributeRegex = new RegExp(`${key}="[^"]*"`);
        if (attributeRegex.test(directiveText)) {
          newText =
            textBefore +
            directiveText.replace(
              attributeRegex,
              `${key}="${value}${CURSOR_MARKER}"`
            ) +
            textAfter;
        } else {
          newText =
            textBefore +
            directiveText.replace(/}/, ` ${key}="${value}${CURSOR_MARKER}"}`) +
            textAfter;
        }
      } else if (position === 'content') {
        const lines = directiveText.split('\n');
        const firstLine = lines[0];
        const directiveContent = lines.slice(1, -1).join('\n');
        const lastLine = lines[lines.length - 1];

        const newContent = directiveContent.trim()
          ? directiveContent.trimEnd() + ' ' + value
          : value;
        newText =
          textBefore +
          firstLine +
          '\n' +
          newContent +
          CURSOR_MARKER +
          '\n' +
          lastLine +
          '\n' +
          textAfter;
      }

      const newCursorPosition = newText.indexOf(CURSOR_MARKER);
      const finalText = newText.replace(CURSOR_MARKER, '');
      const finalCursorPosition =
        newCursorPosition === -1 ? selectionStart : newCursorPosition;

      dispatch(setContent(finalText));
      setTimeout(() => {
        contentEditor.focus();
        contentEditor.setSelectionRange(
          finalCursorPosition,
          finalCursorPosition
        );
      }, 0);
    },
    [contentEditorRef, dispatch]
  );

  const handleTableAction = useCallback(
    ({ direction }: TableButtonProps) => {
      if (!contentEditorRef.current) return;
      const contentEditor = contentEditorRef.current;
      const { selectionStart, selectionEnd, value: content } = contentEditor;
      const ranges = parseTableRanges(content);

      const range = ranges.find(([directiveStart, directiveEnd]) => {
        return selectionStart >= directiveStart && selectionEnd <= directiveEnd;
      });
      if (!range) return;
      const [rangeStart, rangeEnd] = range;
      const [textBefore, tableText, textAfter] = [
        content.substring(0, rangeStart),
        content.substring(rangeStart, rangeEnd),
        content.substring(rangeEnd),
      ];

      const { newTable, cursorPosition } =
        direction === 'row' ? addRow(tableText) : addColumn(tableText);
      const newText = textBefore + newTable + textAfter;
      const newCursorPosition = rangeStart + cursorPosition;

      dispatch(setContent(newText));
      setTimeout(() => {
        contentEditor.focus();
        contentEditor.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    },
    [contentEditorRef, dispatch]
  );

  const onAction = useCallback(
    (contentButtonProps: WritePostContentButtonProps) => {
      const { type } = contentButtonProps;
      if (type === 'markdown') {
        handleMarkdownAction(contentButtonProps);
      } else if (type === 'image' || type === 'bgm') {
        handleDirectiveAction(contentButtonProps);
      } else if (type === 'table') {
        handleTableAction(contentButtonProps);
      }
    },
    [handleDirectiveAction, handleMarkdownAction, handleTableAction]
  );

  useEffect(() => {
    const onSelectionChange = () => {
      if (!contentEditorRef.current) return;
      const contentEditor = contentEditorRef.current;
      const activeElement = document.activeElement;
      if (activeElement !== contentEditor) return;

      const { selectionStart, selectionEnd } = contentEditor;
      const text = contentEditor.value;

      const types = contentButtonProps
        .map(button => button.type)
        .filter(type => type !== 'markdown');

      let activeType = 'markdown';
      for (const type of types) {
        const ranges = parseRanges(text, type);
        if (!ranges) continue;
        const isType = ranges.some(([start, end]) => {
          return selectionStart >= start && selectionEnd <= end;
        });
        if (isType) {
          activeType = type;
          break;
        }
      }
      setActiveType(activeType);
    };

    document.addEventListener('selectionchange', onSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, [contentButtonProps, contentEditorRef]);

  return {
    contentButtons: contentButtonProps,
    activeType,
    onAction,
  } as const;
}

function parseRanges(text: string, type: string) {
  if (type === 'image' || type === 'bgm') {
    return parseDirectiveRanges(text, type);
  } else if (type === 'table') {
    return parseTableRanges(text);
  }
}

function parseDirectiveRanges(text: string, type: string) {
  const ranges: number[][] = [];
  let regex: RegExp;
  if (type === 'image') {
    regex = new RegExp(IMAGE_DIRECTIVE_PATTERN, 'g');
  } else if (type === 'bgm') {
    regex = new RegExp(BGM_DIRECTIVE_PATTERN, 'g');
  } else {
    return ranges;
  }

  let match;
  while ((match = regex.exec(text)) !== null) {
    ranges.push([match.index, match.index + match[0].length]);
  }
  return ranges;
}

function parseTableRanges(text: string) {
  const lines = text.split('\n');
  const ranges: number[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (/^\|[\s\-\|]+\|$/.test(line) && line.includes('-')) {
      let start = i - 1;
      while (start >= 0 && lines[start].trim().includes('|')) {
        start--;
      }
      start++;

      let end = i + 1;
      while (end < lines.length && lines[end].trim().includes('|')) {
        end++;
      }

      const startIndex =
        lines.slice(0, start).join('\n').length + (start > 0 ? 1 : 0);
      const endIndex = lines.slice(0, end).join('\n').length;

      ranges.push([startIndex, endIndex]);
    }
  }

  return ranges;
}

function addRow(tableText: string) {
  const firstLine = tableText.match(/^.*$/m)?.[0];
  if (!firstLine) return { newTable: tableText, cursorPosition: 0 };

  const index = (firstLine.match(/\|/g) || []).length - 1;
  const cells = Array.from({ length: index }, (_, i) => `내용${i + 1}`);
  const newRow = `| ${cells.join(' | ')} |\n`;

  const newTable = tableText + '\n' + newRow;
  const cursorPosition =
    tableText.length + 1 + newRow.indexOf('내용1') + '내용1'.length;

  return { newTable, cursorPosition };
}

function addColumn(tableText: string) {
  const lines = tableText.split('\n').filter(line => line.trim());
  const index = lines[0].trim().split('|').length - 1;
  lines[0] += ` 제목${index} |\n`;
  lines[1] += '-------|\n';
  for (let i = 2; i < lines.length; i++) {
    lines[i] += ` 내용${index} |\n`;
  }

  const newTable = lines.join('');
  const targetText = `제목${index}`;
  const cursorPosition = newTable.indexOf(targetText) + targetText.length;
  return { newTable, cursorPosition };
}
