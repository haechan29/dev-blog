'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LinkEditDialog from '@/components/write/linkEditDialog';
import { OgDto } from '@/features/og/data/dto/ogDto';
import { getOg } from '@/features/og/data/repository/ogClientRepository';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import {
  ExternalLink,
  LayoutList,
  MoreVertical,
  Pencil,
  Square,
  Trash2,
  Type,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Variant = 'vertical' | 'horizontal';

export default function LinkCard({
  node,
  getPos,
  updateAttributes,
  deleteNode,
  editor,
}: NodeViewProps) {
  const { href, variant } = node.attrs as { href: string; variant: Variant };

  const [og, setOg] = useState<OgDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const domain = getDomain(href);

  const convertToInline = useCallback(() => {
    const pos = getPos();
    if (typeof pos !== 'number') return;

    editor
      .chain()
      .focus()
      .insertContentAt(
        { from: pos, to: pos + node.nodeSize },
        {
          type: 'text',
          text: og?.title || href,
          marks: [
            {
              type: 'link',
              attrs: { href, isNewlyInserted: false },
            },
          ],
        }
      )
      .run();
  }, [editor, getPos, href, node.nodeSize, og?.title]);

  const handleVariantChange = (
    newVariant: 'vertical' | 'horizontal' | 'inline'
  ) => {
    if (newVariant === 'inline') {
      convertToInline();
    } else {
      updateAttributes({ variant: newVariant });
    }
  };

  const handleOpenLink = () => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (!isValidUrl(href)) {
      setIsFailed(true);
      return;
    }

    setIsLoading(true);
    setIsFailed(false);
    getOg(href)
      .then(data => {
        const youtubeVideoId = getYouTubeVideoId(href);
        if (youtubeVideoId && !data.image) {
          data.image = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
        }
        setOg(data);
        if (!data.title || !data.image) {
          setIsFailed(true);
        }
      })
      .catch(() => {
        setOg(null);
        setIsFailed(true);
      })
      .finally(() => setIsLoading(false));
  }, [href]);

  useEffect(() => {
    if (isFailed) {
      toast.error('미리보기를 불러오지 못했습니다');
      convertToInline();
    }
  }, [convertToInline, isFailed]);

  if (isLoading) {
    return <LoadingSkeleton variant={variant} />;
  }

  if (og === null || !og.title || !og.image) {
    return null;
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
          onOpenChange={setIsEditDialogOpen}
          initialUrl={href}
          onSave={url => updateAttributes({ href: url })}
          title='링크 편집'
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
        onOpenChange={setIsEditDialogOpen}
        initialUrl={href}
        onSave={url => updateAttributes({ href: url })}
        title='링크 편집'
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
