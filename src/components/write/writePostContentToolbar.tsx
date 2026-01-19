'use client';

import DailyQuotaExhaustedDialog from '@/components/image/DailyQuotaExhaustedDialog';
import Tooltip from '@/components/tooltip';
import { DailyQuotaExhaustedError } from '@/features/image/data/errors/imageErrors';
import useContentToolbar from '@/features/write/hooks/useContentToolbar';
import useImageUpload from '@/features/write/hooks/useImageUpload';
import useWritePostContentButton from '@/features/write/hooks/useWritePostContentButton';
import {
  ButtonContent,
  buttonProps,
  dropdownGroups,
  WritePostContentButtonProps,
} from '@/features/write/ui/writePostContentButtonProps';
import clsx from 'clsx';
import {
  AlignCenter,
  Captions,
  ChevronDown,
  Code2,
  Columns,
  Expand,
  Grid2x2,
  ImageIcon,
  Link,
  List,
  Minus,
  MoreHorizontal,
  Music,
  Quote,
  Rows,
  Shrink,
  Timer,
  Underline,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const toolbarLayout = {
  default: [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'link',
    'image',
    { group: 'heading', items: ['heading1', 'heading2', 'heading3'] },
    { group: 'list', items: ['unorderedList', 'orderedList'] },
    {
      group: 'more',
      items: ['bgm', 'code', 'table', 'horizontalRule', 'blockquote'],
    },
  ],
  table: ['addRow', 'addColumn'],
  code: ['codeLanguage'],
  image: ['imageLarge', 'imageSmall', 'imageCaption', 'imageSubtitle'],
  bgm: ['bgmStartTime'],
};

export default function WritePostContentToolbar({
  isSpeakerPanelOpen,
  setIsSpeakerPanelOpen,
}: {
  isSpeakerPanelOpen: boolean;
  setIsSpeakerPanelOpen: (open: boolean) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { uploadAndInsert } = useImageUpload();
  const [isQuotaDialogOpen, setIsQuotaDialogOpen] = useState(false);

  const { activeCategory, onAction } = useWritePostContentButton({
    onUpload: () => fileInputRef.current?.click(),
  });
  const {
    contentToolbar: { shouldAttachToolbarToBottom, toolbarTranslateY },
  } = useContentToolbar();

  return (
    <>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        multiple
        hidden
        onChange={async e => {
          const files = Array.from(e.target.files || []);
          if (files.length === 0) return;

          try {
            await uploadAndInsert(files);
          } catch (error) {
            if (error instanceof DailyQuotaExhaustedError) {
              setIsQuotaDialogOpen(true);
            }
          }
          e.target.value = '';
        }}
      />

      <div
        onMouseDown={e => e.preventDefault()} // prevent keyboard from closing
        onTouchStart={e => e.preventDefault()} // prevent keyboard from closing
        className={clsx(
          'w-full flex px-2 py-1 gap-1 overflow-x-auto scrollbar-hide border-gray-200',
          'transition-transform duration-300 ease-in-out',
          'translate-y-(--toolbar-translate-y)',
          shouldAttachToolbarToBottom
            ? 'fixed inset-x-0 z-50 w-screen top-full bg-white/80 backdrop-blur-md touch-pan-x'
            : 'rounded-t-lg border-t border-x',
          shouldAttachToolbarToBottom && isSpeakerPanelOpen && 'hidden'
        )}
        style={{
          '--toolbar-translate-y': toolbarTranslateY,
        }}
      >
        {toolbarLayout[activeCategory].map(item => {
          if (typeof item === 'string') {
            const button = buttonProps[item];
            if (!button) return null;
            return (
              <Tooltip key={item} text={button.label} direction='top'>
                <button
                  onClick={() => onAction(button)}
                  className='min-w-10 h-10 flex items-center justify-center shrink-0 p-2 rounded hover:bg-gray-100 cursor-pointer'
                >
                  <ContentButton buttonContent={button.content} />
                </button>
              </Tooltip>
            );
          }
          return (
            <ToolbarDropdown
              key={item.group}
              group={item.group}
              items={item.items}
              onAction={onAction}
            />
          );
        })}
      </div>

      <DailyQuotaExhaustedDialog
        isOpen={isQuotaDialogOpen}
        setIsOpen={setIsQuotaDialogOpen}
      />
    </>
  );
}

function ToolbarDropdown({
  group,
  items,
  onAction,
}: {
  group: string;
  items: string[];
  onAction: (button: WritePostContentButtonProps) => void;
}) {
  const groupProps = dropdownGroups[group];
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
    positioned: boolean;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    contentToolbar: { shouldAttachToolbarToBottom },
  } = useContentToolbar();

  useEffect(() => {
    if (!triggerRef.current || !isOpen) {
      setMenuPosition(null);
      return;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    setMenuPosition({
      top: shouldAttachToolbarToBottom
        ? triggerRect.top - 4
        : triggerRect.bottom + 4,
      left: triggerRect.left + triggerRect.width / 2,
      positioned: false,
    });
  }, [isOpen, shouldAttachToolbarToBottom]);

  useEffect(() => {
    if (!menuPosition || menuPosition.positioned || !menuRef.current) return;

    const menuWidth = menuRef.current.offsetWidth;
    const padding = 8;

    let left = menuPosition.left;
    const minLeft = padding + menuWidth / 2;
    const maxLeft = window.innerWidth - padding - menuWidth / 2;
    left = Math.max(minLeft, Math.min(maxLeft, left));

    setMenuPosition({
      ...menuPosition,
      left,
      positioned: true,
    });
  }, [menuPosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const trigger = triggerRef.current;
    const rect = trigger.getBoundingClientRect();
    const threshold = 5;

    const rootMargin = [
      -(rect.top - threshold), // top
      -(window.innerWidth - rect.right - threshold), // right
      -(window.innerHeight - rect.bottom - threshold), // bottom
      -(rect.left - threshold), // left
    ]
      .map(v => `${v}px`)
      .join(' ');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsOpen(false);
        }
      },
      { rootMargin, threshold: 1 }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [isOpen]);

  if (!groupProps) return null;

  return (
    <>
      <Tooltip text={groupProps.label} direction='top'>
        <button
          ref={triggerRef}
          onPointerDown={e => e.preventDefault()}
          onClick={() => setIsOpen(prev => !prev)}
          className='min-w-10 h-10 flex items-center justify-center shrink-0 p-2 rounded hover:bg-gray-100 cursor-pointer gap-0.5'
        >
          <ContentButton buttonContent={groupProps.content} />
          {group !== 'more' && (
            <ChevronDown className='w-3 h-3 text-gray-400' />
          )}
        </button>
      </Tooltip>

      {isOpen &&
        menuPosition &&
        createPortal(
          <div
            ref={menuRef}
            onPointerDown={e => e.preventDefault()}
            className={clsx(
              'fixed z-50 min-w-32 rounded-md border bg-white p-1 shadow-md -translate-x-1/2',
              shouldAttachToolbarToBottom && '-translate-y-full',
              !menuPosition.positioned && 'invisible'
            )}
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
            }}
          >
            {items.map(id => {
              const button = buttonProps[id];
              if (!button) return null;
              return (
                <button
                  key={id}
                  onPointerDown={e => e.preventDefault()}
                  onClick={() => {
                    onAction(button);
                    setIsOpen(false);
                  }}
                  className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 cursor-pointer'
                >
                  <ContentButton buttonContent={button.content} />
                  <span>{button.label}</span>
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}

function ContentButton({
  buttonContent: { icon, style, value },
}: {
  buttonContent: ButtonContent;
}) {
  switch (icon) {
    case 'text':
      return <div className={style}>{value}</div>;
    case 'link':
      return <Link className={style} />;
    case 'heading':
      return <div className={style}>H</div>;
    case 'list':
      return <List className={style} />;
    case 'more':
      return <MoreHorizontal className={style} />;
    case 'code':
      return <Code2 className={style} />;
    case 'table':
      return <Grid2x2 className={style} />;
    case 'blockquote':
      return <Quote className={style} />;
    case 'horizontalRule':
      return <Minus className={style} />;
    case 'image':
      return <ImageIcon className={style} />;
    case 'imageLarge':
      return <Expand className={style} />;
    case 'imageSmall':
      return <Shrink className={style} />;
    case 'imageCaption':
      return <AlignCenter className={style} />;
    case 'imageSubtitle':
      return <Captions className={style} />;
    case 'addRow':
      return <Rows className={style} />;
    case 'addColumn':
      return <Columns className={style} />;
    case 'bgm':
      return <Music className={style} />;
    case 'bgmStartTime':
      return <Timer className={style} />;
    case 'underline':
      return <Underline className={style} />;
  }
}
