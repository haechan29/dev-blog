'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import clsx from 'clsx';
import { ChevronDown, LucideIcon } from 'lucide-react';

type StyleOption = {
  label: string;
  icon: LucideIcon;
  active: boolean;
};

export default function EditorToolbarStyleDropdown({
  styles,
  onSelect,
}: {
  styles: readonly StyleOption[];
  onSelect: (label: string) => void;
}) {
  const currentStyle = styles.find(style => style.active) ?? styles[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          className={clsx(
            'h-8 px-2 rounded text-sm flex items-center gap-1.5 shrink-0 cursor-pointer',
            'hover:bg-gray-100'
          )}
        >
          <currentStyle.icon className='w-4 h-4 text-gray-700' />
          <span className='text-gray-700'>{currentStyle.label}</span>
          <ChevronDown className='w-3.5 h-3.5 text-gray-500' />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='start'>
        {styles.map(style => (
          <DropdownMenuItem
            key={style.label}
            onClick={() => onSelect(style.label)}
            className={clsx(
              'cursor-pointer gap-2',
              style.active && 'bg-accent font-medium'
            )}
          >
            <style.icon className='w-4 h-4 text-gray-700' />
            <span>{style.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
