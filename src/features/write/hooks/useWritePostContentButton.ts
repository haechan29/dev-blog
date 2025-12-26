'use client';

import {
  addColumn,
  addRow,
  parseCodeRanges,
  parseDirectiveRanges,
  parseRanges,
  parseTableRanges,
} from '@/features/write/domain/lib/contentButton';
import { writePostContentButtons } from '@/features/write/domain/model/writePostContentButton';
import useWritePostForm from '@/features/write/hooks/useWritePostForm';
import {
  ButtonCategory,
  CodeButtonProps,
  createProps,
  DirectiveButtonProps,
  MarkdownButtonProps,
  TableButtonProps,
  WritePostContentButtonProps,
} from '@/features/write/ui/writePostContentButtonProps';
import { AppDispatch } from '@/lib/redux/store';
import { setContent } from '@/lib/redux/write/writePostFormSlice';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

const CURSOR_MARKER = '__NEW_CURSOR_POSITION__';

export default function useWritePostContentButton({
  onUpload,
}: {
  onUpload: () => void;
}) {
  const {
    writePostForm: {
      content: { value: content },
    },
  } = useWritePostForm();
  const dispatch = useDispatch<AppDispatch>();
  const [contentButtons] = useState(writePostContentButtons);
  const [activeCategory, setActiveCategory] =
    useState<ButtonCategory>('default');
  const contentButtonProps = useMemo(() => {
    return contentButtons.map(createProps);
  }, [contentButtons]);

  const handleMarkdownAction = useCallback(
    ({ isBlock, markdownBefore, markdownAfter = '' }: MarkdownButtonProps) => {
      const contentEditor = document.querySelector(
        '[data-content-editor]'
      ) as HTMLTextAreaElement;
      if (!contentEditor) return;

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

      dispatch(setContent({ value: finalText, isUserInput: false }));
      setTimeout(() => {
        contentEditor.focus();
        contentEditor.setSelectionRange(
          finalCursorPosition,
          finalCursorPosition
        );
      }, 100);
    },
    [content, dispatch]
  );

  const handleDirectiveAction = useCallback(
    ({ category, position, key, value }: DirectiveButtonProps) => {
      const contentEditor = document.querySelector(
        '[data-content-editor]'
      ) as HTMLTextAreaElement;
      if (!contentEditor) return;
      const { selectionStart, selectionEnd, value: content } = contentEditor;
      const ranges = parseDirectiveRanges(content, category);

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

      dispatch(setContent({ value: finalText, isUserInput: false }));
      setTimeout(() => {
        contentEditor.focus();
        contentEditor.setSelectionRange(
          finalCursorPosition,
          finalCursorPosition
        );
      }, 100);
    },
    [dispatch]
  );

  const handleTableAction = useCallback(
    ({ direction }: TableButtonProps) => {
      const contentEditor = document.querySelector(
        '[data-content-editor]'
      ) as HTMLTextAreaElement;
      if (!contentEditor) return;
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

      dispatch(setContent({ value: newText, isUserInput: false }));
      setTimeout(() => {
        contentEditor.focus();
        contentEditor.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 100);
    },
    [dispatch]
  );

  const handleCodeAction = useCallback(
    ({ field }: CodeButtonProps) => {
      const contentEditor = document.querySelector(
        '[data-content-editor]'
      ) as HTMLTextAreaElement;
      if (!contentEditor) return;
      const { selectionStart, selectionEnd, value: content } = contentEditor;
      const ranges = parseCodeRanges(content);

      const range = ranges.find(([rangeStart, rangeEnd]) => {
        return selectionStart >= rangeStart && selectionEnd <= rangeEnd;
      });
      if (!range) return;
      const [rangeStart, rangeEnd] = range;
      const [textBefore, codeText, textAfter] = [
        content.substring(0, rangeStart),
        content.substring(rangeStart, rangeEnd),
        content.substring(rangeEnd),
      ];

      if (field === 'language') {
        const firstLineEnd = codeText.indexOf('\n');
        if (firstLineEnd < 0) return;
        const firstLine = codeText.slice(0, firstLineEnd);
        const restLines = codeText.slice(firstLineEnd);
        const language = firstLine.slice(3);
        const newLanguages = ['', 'javascript', 'python', 'text', ''];
        const newLanguage = newLanguages[newLanguages.indexOf(language) + 1];
        const newText =
          textBefore + '```' + newLanguage + restLines + textAfter;
        const newCursorPosition = textBefore.length + 3 + newLanguage.length;

        dispatch(setContent({ value: newText, isUserInput: false }));
        setTimeout(() => {
          contentEditor.focus();
          contentEditor.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 100);
      }
    },
    [dispatch]
  );

  const onAction = useCallback(
    (contentButtonProps: WritePostContentButtonProps) => {
      const { action } = contentButtonProps;
      if (action === 'upload') {
        onUpload();
      } else if (action === 'markdown') {
        handleMarkdownAction(contentButtonProps);
      } else if (action === 'directive') {
        handleDirectiveAction(contentButtonProps);
      } else if (action === 'table') {
        handleTableAction(contentButtonProps);
      } else if (action === 'code') {
        handleCodeAction(contentButtonProps);
      }
    },
    [
      handleCodeAction,
      handleDirectiveAction,
      handleMarkdownAction,
      handleTableAction,
      onUpload,
    ]
  );

  useEffect(() => {
    const onSelectionChange = () => {
      const contentEditor = document.querySelector(
        '[data-content-editor]'
      ) as HTMLTextAreaElement;
      if (!contentEditor) return;
      const activeElement = document.activeElement;
      if (activeElement !== contentEditor) return;

      const { selectionStart, selectionEnd } = contentEditor;
      const text = contentEditor.value;

      const categories = contentButtonProps
        .map(button => button.category)
        .filter(category => category !== 'default');

      let newActiveCategory: ButtonCategory = 'default';
      for (const category of categories) {
        const ranges = parseRanges(text, category);
        if (!ranges) continue;
        const isInRange = ranges.some(([start, end]) => {
          return selectionStart >= start && selectionEnd <= end;
        });
        if (isInRange) {
          newActiveCategory = category;
          break;
        }
      }
      setActiveCategory(newActiveCategory);
    };

    document.addEventListener('selectionchange', onSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, [contentButtonProps]);

  return {
    contentButtons: contentButtonProps,
    activeCategory,
    onAction,
  } as const;
}
