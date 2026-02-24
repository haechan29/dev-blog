'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OgDto } from '@/features/og/data/dto/ogDto';
import { getOg } from '@/features/og/data/repository/ogClientRepository';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import {
  ExternalLink,
  LayoutList,
  MoreVertical,
  Pencil,
  Square,
  Trash2,
  Type,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Variant = 'vertical' | 'horizontal';

export default function LinkCard({
  node,
  updateAttributes,
  deleteNode,
  editor,
}: NodeViewProps) {
  const { href, variant } = node.attrs as { href: string; variant: Variant };

  const [og, setOg] = useState<OgDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editUrl, setEditUrl] = useState(href);
  const [isUrlValid, setIsUrlValid] = useState(true);

  const domain = getDomain(href);

  const handleVariantChange = (
    newVariant: 'vertical' | 'horizontal' | 'inline'
  ) => {
    if (newVariant === 'inline') {
      const linkText = og?.title || href;
      deleteNode();
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${href}">${linkText}</a>`)
        .run();
    } else {
      updateAttributes({ variant: newVariant });
    }
  };

  const handleUrlSave = () => {
    if (!editUrl.trim() || !isValidUrl(editUrl)) {
      setIsUrlValid(false);
      return;
    }
    updateAttributes({ href: editUrl });
    setIsEditDialogOpen(false);
  };

  const handleOpenLink = () => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (!isValidUrl(href)) return;

    setIsLoading(true);
    getOg(href)
      .then(data => {
        const youtubeVideoId = getYouTubeVideoId(href);
        if (youtubeVideoId && !data.image) {
          data.image = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
        }
        setOg(data);
      })
      .catch(() => setOg(null))
      .finally(() => setIsLoading(false));
  }, [href]);

  useEffect(() => {
    if (!isEditDialogOpen) {
      setEditUrl(href);
      setIsUrlValid(true);
    }
  }, [isEditDialogOpen, href]);

  if (isLoading) {
    return <LoadingSkeleton variant={variant} />;
  }

  if (!og?.title || !og.image) {
    return (
      <NodeViewWrapper className='not-prose my-4 relative'>
        <a
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600 hover:underline'
        >
          {href}
        </a>
      </NodeViewWrapper>
    );
  }

  if (variant === 'vertical') {
    return (
      <NodeViewWrapper className='not-prose flex flex-col w-full max-w-md overflow-hidden rounded-lg border border-gray-200 hover:bg-gray-50 my-4 relative group'>
        <LinkCardDropdown
          variant={variant}
          onEditStart={() => setIsEditDialogOpen(true)}
          onVariantChange={handleVariantChange}
          onOpenLink={handleOpenLink}
          onDelete={deleteNode}
        />
        <LinkEditDialog
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          editUrl={editUrl}
          setEditUrl={setEditUrl}
          isUrlValid={isUrlValid}
          setIsUrlValid={setIsUrlValid}
          onSave={handleUrlSave}
        />
        <a href={href} target='_blank' rel='noopener noreferrer'>
          <div className='w-full aspect-video overflow-hidden'>
            <Image
              width={1000}
              height={1000}
              src={og.image}
              alt={og.title}
              className='h-full w-full object-cover m-0! rounded-none!'
            />
          </div>
          <div className='flex flex-col gap-1 p-4'>
            <span className='truncate text-sm font-semibold text-gray-900'>
              {og.title}
            </span>
            {og.description && (
              <span className='line-clamp-2 text-xs text-gray-500'>
                {og.description}
              </span>
            )}
            <span className='text-xs text-gray-400'>
              {og.siteName || domain}
            </span>
          </div>
        </a>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className='not-prose flex w-full max-w-lg overflow-hidden rounded-lg border border-gray-200 hover:bg-gray-50 my-4 relative group'>
      <LinkCardDropdown
        variant={variant}
        onEditStart={() => setIsEditDialogOpen(true)}
        onVariantChange={handleVariantChange}
        onOpenLink={handleOpenLink}
        onDelete={deleteNode}
      />
      <LinkEditDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        editUrl={editUrl}
        setEditUrl={setEditUrl}
        isUrlValid={isUrlValid}
        setIsUrlValid={setIsUrlValid}
        onSave={handleUrlSave}
      />
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className='flex w-full'
      >
        <div className='w-24 h-24 sm:w-32 sm:h-32 overflow-hidden shrink-0'>
          <Image
            width={200}
            height={200}
            src={og.image}
            alt={og.title}
            className='h-full w-full object-cover m-0! rounded-none!'
          />
        </div>
        <div className='flex flex-col justify-center gap-1 p-4 flex-1 min-w-0'>
          <span className='truncate text-sm font-semibold text-gray-900'>
            {og.title}
          </span>
          {og.description && (
            <span className='line-clamp-2 text-xs text-gray-500'>
              {og.description}
            </span>
          )}
          <span className='text-xs text-gray-400'>{og.siteName || domain}</span>
        </div>
      </a>
    </NodeViewWrapper>
  );
}

function LoadingSkeleton({ variant }: { variant: Variant }) {
  if (variant === 'vertical') {
    return (
      <NodeViewWrapper className='not-prose flex flex-col w-full max-w-md overflow-hidden rounded-lg border border-gray-200 my-4 animate-pulse'>
        <div className='w-full aspect-video bg-gray-200' />
        <div className='flex flex-col gap-2 p-4'>
          <div className='h-4 bg-gray-200 rounded w-3/4' />
          <div className='h-3 bg-gray-200 rounded w-full' />
        </div>
      </NodeViewWrapper>
    );
  }
  return (
    <NodeViewWrapper className='not-prose flex w-full max-w-lg overflow-hidden rounded-lg border border-gray-200 my-4 animate-pulse'>
      <div className='w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 shrink-0' />
      <div className='flex flex-col gap-2 p-4 flex-1'>
        <div className='h-4 bg-gray-200 rounded w-3/4' />
        <div className='h-3 bg-gray-200 rounded w-full' />
        <div className='h-3 bg-gray-200 rounded w-1/2' />
      </div>
    </NodeViewWrapper>
  );
}

function LinkCardDropdown({
  variant,
  onEditStart,
  onVariantChange,
  onOpenLink,
  onDelete,
}: {
  variant: Variant;
  onEditStart: () => void;
  onVariantChange: (variant: 'vertical' | 'horizontal' | 'inline') => void;
  onOpenLink: () => void;
  onDelete: () => void;
}) {
  return (
    <div className='absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className='p-1.5 backdrop-blur-md rounded-lg shadow-sm bg-black/50 hover:bg-black/60 cursor-pointer'>
            <MoreVertical size={16} className='text-white' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => onVariantChange('inline')}>
            <Type size={16} className='mr-1' />
            인라인
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onVariantChange('horizontal')}>
            <LayoutList size={16} className='mr-1' />
            가로 카드
            {variant === 'horizontal' && <span className='ml-auto'>✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onVariantChange('vertical')}>
            <Square size={16} className='mr-1' />
            세로 카드
            {variant === 'vertical' && <span className='ml-auto'>✓</span>}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onEditStart}>
            <Pencil size={16} className='mr-1' />
            링크 편집
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onOpenLink}>
            <ExternalLink size={16} className='mr-1' />
            링크 열기
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onDelete} className='text-red-500'>
            <Trash2 size={16} className='mr-1' />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function LinkEditDialog({
  isOpen,
  setIsOpen,
  editUrl,
  setEditUrl,
  isUrlValid,
  setIsUrlValid,
  onSave,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editUrl: string;
  setEditUrl: (url: string) => void;
  isUrlValid: boolean;
  setIsUrlValid: (isValid: boolean) => void;
  onSave: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>링크 편집</DialogTitle>
        <DialogDescription className='sr-only'>
          링크 URL을 수정할 수 있습니다.
        </DialogDescription>

        <div className='text-xl font-bold mt-2 mb-6'>링크 편집</div>

        <input
          className={clsx(
            'w-full border p-3 mb-2 rounded-sm outline-none',
            isUrlValid
              ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
              : 'border-red-400 animate-shake',
            editUrl ? 'bg-white' : 'bg-gray-50'
          )}
          type='url'
          value={editUrl}
          onChange={e => {
            setEditUrl(e.target.value);
            setIsUrlValid(true);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') onSave();
          }}
          placeholder='https://example.com'
          autoFocus
        />

        {!isUrlValid && (
          <p className='text-red-500 text-sm mb-6'>
            올바른 URL을 입력해주세요.
          </p>
        )}

        {isUrlValid && <div className='mb-6' />}

        <div className='flex justify-between items-center'>
          <button
            className='flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white bg-blue-600 hover:bg-blue-500'
            onClick={onSave}
          >
            완료
          </button>
          <DialogClose asChild>
            <X className='w-10 h-10 p-2 cursor-pointer' />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
