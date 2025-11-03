'use client';

import { writePostContentButtons } from '@/features/write/domain/model/writePostContentButton';
import {
  createProps,
  DirectiveButtonProps,
  MarkdownButtonProps,
  WritePostContentButtonProps,
} from '@/features/write/ui/writePostContentButtonProps';
import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';

const IMAGE_DIRECTIVE_PATTERN = ':::img[\\s\\S]*?:::';

export default function useWritePostContentButton({
  value: content,
  contentEditorRef,
  setContent,
}: {
  value: string;
  contentEditorRef: RefObject<HTMLTextAreaElement | null>;
  setContent: (content: string) => void;
}) {
  const [contentButtons] = useState(writePostContentButtons);
  const [directiveType, setDirectiveType] = useState('markdown');
  const contentButtonProps = useMemo(() => {
    return contentButtons.map(createProps);
  }, [contentButtons]);

  const handleMarkdownAction = useCallback(
    ({ action, markdownBefore, markdownAfter = '' }: MarkdownButtonProps) => {
      if (!contentEditorRef.current) return;
      const contentEditor = contentEditorRef.current;

      const { selectionStart, selectionEnd } = contentEditor;
      const [textBefore, selectedText, textAfter] = [
        content.substring(0, selectionStart),
        content.substring(selectionStart, selectionEnd),
        content.substring(selectionEnd),
      ];
      const isWrapped = selectedText
        ? selectedText.length >=
            markdownBefore.length + (markdownAfter.length ?? 0) &&
          selectedText.startsWith(markdownBefore) &&
          selectedText.endsWith(markdownAfter)
        : textBefore.endsWith(markdownBefore) &&
          textAfter.startsWith(markdownAfter);

      const shouldInsert = action === 'insert' || !isWrapped;

      let newText = '';
      let newCursorPosition = 0;

      if (shouldInsert) {
        newText =
          textBefore +
          markdownBefore +
          selectedText +
          markdownAfter +
          textAfter;
        newCursorPosition = selectedText
          ? textBefore.length + newText.length
          : textBefore.length + markdownBefore.length;
      } else {
        newText = selectedText
          ? textBefore +
            selectedText.slice(markdownBefore.length, -markdownAfter.length) +
            textAfter
          : textBefore.slice(0, -markdownBefore.length) +
            textAfter.slice(markdownAfter.length);
        newCursorPosition = selectedText
          ? newText.length - textAfter.length
          : textBefore.length - markdownBefore.length;
      }

      setContent(newText);
      setTimeout(() => {
        contentEditor.focus();
        contentEditor.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    },
    [content, contentEditorRef, setContent]
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
      let newCursorPosition = selectionStart;

      if (position === 'attribute') {
        const attributeRegex = new RegExp(`${key}="[^"]*"`);
        if (attributeRegex.test(directiveText)) {
          newText =
            textBefore +
            directiveText.replace(attributeRegex, `${key}="${value}"`) +
            textAfter;
        } else {
          newText =
            textBefore +
            directiveText.replace(/}/, ` ${key}="${value}"`) +
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
          '\n' +
          lastLine +
          textAfter;
        newCursorPosition =
          newText.length - textAfter.length - lastLine.length - 1;
      }

      setContent(newText);
      setTimeout(() => {
        contentEditor.focus();
        contentEditor.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    },
    [contentEditorRef, setContent]
  );

  const onAction = useCallback(
    (contentButtonProps: WritePostContentButtonProps) => {
      const { type } = contentButtonProps;
      if (type === 'markdown') {
        handleMarkdownAction(contentButtonProps);
      } else if (type === 'image') {
        handleDirectiveAction(contentButtonProps);
      }
    },
    [handleDirectiveAction, handleMarkdownAction]
  );

  useEffect(() => {
    const onSelectionChange = () => {
      if (!contentEditorRef.current) return;
      const contentEditor = contentEditorRef.current;
      const activeElement = document.activeElement;
      if (activeElement !== contentEditor) return;

      const { selectionStart, selectionEnd } = contentEditor;
      const text = contentEditor.value;

      const directiveTypes = contentButtonProps
        .map(button => button.type)
        .filter(type => type !== 'markdown');

      let directiveType = 'markdown';
      for (const type of directiveTypes) {
        const ranges = parseDirectiveRanges(text, type);
        const isInDirective = ranges.some(([start, end]) => {
          return selectionStart >= start && selectionEnd <= end;
        });
        if (isInDirective) {
          directiveType = type;
          break;
        }
      }
      setDirectiveType(directiveType);
    };

    document.addEventListener('selectionchange', onSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, [contentButtonProps, contentEditorRef]);

  return {
    contentButtons: contentButtonProps,
    directiveType,
    onAction,
  } as const;
}

function parseDirectiveRanges(text: string, type: string) {
  const ranges: number[][] = [];

  let regex: RegExp;
  if (type === 'image') {
    regex = new RegExp(IMAGE_DIRECTIVE_PATTERN, 'g');
  } else {
    return ranges;
  }

  let match;
  while ((match = regex.exec(text)) !== null) {
    ranges.push([match.index, match.index + match[0].length]);
  }
  return ranges;
}
