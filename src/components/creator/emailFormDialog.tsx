'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { ApiError } from '@/errors/errors';
import { OUTREACH_EMAIL_TEMPLATES } from '@/features/outreach-email/constants/templates';
import * as OutreachEmailClientRepository from '@/features/outreach-email/data/repository/outreachEmailClientRepository';
import { Loader2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function EmailFormDialog({
  creatorId,
  creatorName,
  isOpen,
  setIsOpen,
  onSuccess,
}: {
  creatorId: string;
  creatorName: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSubject('');
      setBody('');
    }
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error('제목과 본문을 입력해주세요');
      return;
    }

    setIsSending(true);
    try {
      await OutreachEmailClientRepository.sendOutreachEmail({
        creatorId,
        subject,
        body,
      });

      toast.success('발송되었습니다');
      onSuccess();
      setIsOpen(false);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : '메일 발송에 실패했습니다';
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  }, [subject, body, creatorId, onSuccess, setIsOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>이메일 발송</DialogTitle>
        <DialogDescription className='sr-only'>
          이메일을 작성해주세요.
        </DialogDescription>

        <div className='text-xl font-bold mt-2 mb-6'>이메일 발송</div>

        <div className='space-y-4 mb-8'>
          <select
            onChange={e => {
              const template = OUTREACH_EMAIL_TEMPLATES.find(
                t => t.id === e.target.value
              );
              if (template) {
                setSubject(template.subject);
                setBody(template.body(creatorName));
              }
            }}
            className='w-full border border-gray-200 p-3 rounded-sm outline-none hover:border-blue-500 focus:border-blue-500'
            defaultValue=''
          >
            <option value='' disabled>
              템플릿 선택
            </option>
            {OUTREACH_EMAIL_TEMPLATES.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <input
            type='text'
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder='제목'
            className='w-full border border-gray-200 p-3 rounded-sm outline-none hover:border-blue-500 focus:border-blue-500'
          />

          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder='본문'
            rows={8}
            className='w-full border border-gray-200 p-3 rounded-sm outline-none hover:border-blue-500 focus:border-blue-500 resize-none'
          />
        </div>

        <div className='flex justify-between items-center'>
          <button
            onClick={handleSend}
            disabled={isSending}
            className='flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white bg-blue-500 hover:bg-blue-400 disabled:bg-blue-400'
          >
            {isSending ? (
              <Loader2 size={18} strokeWidth={3} className='animate-spin' />
            ) : (
              '발송'
            )}
          </button>
          <DialogClose asChild>
            <X className='w-10 h-10 p-2 cursor-pointer' />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
