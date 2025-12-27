'use client';

import DailyQuotaExhaustedDialog from '@/components/image/DailyQuotaExhaustedDialog';
import Tooltip from '@/components/tooltip';
import { DailyQuotaExhaustedError } from '@/features/image/data/errors/imageErrors';
import useContentToolbar from '@/features/write/hooks/useContentToolbar';
import useImageUpload from '@/features/write/hooks/useImageUpload';
import useWritePostContentButton from '@/features/write/hooks/useWritePostContentButton';
import { ButtonContent } from '@/features/write/ui/writePostContentButtonProps';
import clsx from 'clsx';
import {
  AlignCenter,
  Captions,
  Code2,
  Columns,
  Expand,
  Grid2x2,
  ImageIcon,
  Link,
  Minus,
  Music,
  Quote,
  Rows,
  Shrink,
  Timer,
} from 'lucide-react';
import { useRef, useState } from 'react';

export default function WritePostContentToolbar() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { uploadAndInsert } = useImageUpload();
  const [isQuotaDialogOpen, setIsQuotaDialogOpen] = useState(false);

  const { contentButtons, activeCategory, onAction } =
    useWritePostContentButton({
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
            : 'rounded-t-lg border-t border-x'
        )}
        style={{
          '--toolbar-translate-y': toolbarTranslateY,
        }}
      >
        {contentButtons
          .filter(button => button.category === activeCategory)
          .map(button => (
            <Tooltip key={button.label} text={button.label} direction='top'>
              <button
                onClick={() => onAction(button)}
                className='min-w-10 h-10 flex items-center justify-center shrink-0 p-2 rounded hover:bg-gray-100 cursor-pointer'
              >
                <ContentButton buttonContent={button.content} />
              </button>
            </Tooltip>
          ))}
      </div>

      <DailyQuotaExhaustedDialog
        isOpen={isQuotaDialogOpen}
        setIsOpen={setIsQuotaDialogOpen}
      />
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
  }
}
