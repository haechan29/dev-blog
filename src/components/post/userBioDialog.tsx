'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import SimpleBar from 'simplebar-react';

export default function UserBioDialog({
  userName,
  userBio,
  isOpen,
  setIsOpen,
}: {
  userName: string;
  userBio: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>{userName}의 소개</DialogTitle>
        <DialogDescription className='sr-only'>
          {userName}의 소개글입니다.
        </DialogDescription>

        <div className='text-xl font-bold mt-2 mb-4 line-clamp-2'>
          {userName}
        </div>

        <div className='bg-gray-50 rounded-sm mb-6 border max-h-64 overflow-hidden'>
          <SimpleBar className='h-full px-4 pt-4 simplebar-hover'>
            <>
              <div className='text-sm text-gray-700 leading-relaxed break-keep whitespace-pre-wrap'>
                {userBio}
              </div>
              <div className='w-1 h-4' aria-hidden={true} />
            </>
          </SimpleBar>
        </div>

        <div className='flex justify-end'>
          <DialogClose asChild>
            <X className='w-10 h-10 p-2 cursor-pointer' />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
