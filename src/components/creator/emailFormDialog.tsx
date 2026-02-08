'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ApiError } from '@/errors/errors';
import { OUTREACH_EMAIL_TEMPLATES } from '@/features/outreach-email/constants/templates';
import * as OutreachEmailAction from '@/features/outreach-email/domain/action/outreachEmailAction';
import { OutreachEmail } from '@/features/outreach-email/domain/model/outreachEmail';
import clsx from 'clsx';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function EmailFormDialog({
  creatorId,
  creatorName,
  latestReceivedEmail,
  isOpen,
  setIsOpen,
  onSuccess,
}: {
  creatorId: string;
  creatorName: string;
  latestReceivedEmail: OutreachEmail | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [invalidField, setInvalidField] = useState<'subject' | 'body' | null>(
    null
  );
  const [mode, setMode] = useState<'send' | 'reply'>('send');

  const handleSend = useCallback(async () => {
    if (!subject.trim()) {
      setInvalidField('subject');
      return;
    }

    if (!body.trim()) {
      setInvalidField('body');
      return;
    }

    setIsSending(true);
    try {
      await OutreachEmailAction.sendOutreachEmail({
        creatorId,
        subject,
        body,
        replyToEmailId: mode === 'reply' ? latestReceivedEmail?.id : undefined,
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
  }, [
    body,
    creatorId,
    latestReceivedEmail?.id,
    mode,
    onSuccess,
    setIsOpen,
    subject,
  ]);

  useEffect(() => {
    if (!isOpen) {
      setSubject('');
      setBody('');
      setMode('send');
      setInvalidField(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && latestReceivedEmail) {
      setMode('reply');
    }
  }, [isOpen, latestReceivedEmail]);

  useEffect(() => {
    if (mode === 'reply' && latestReceivedEmail) {
      const originalSubject = latestReceivedEmail.subject;
      const replySubject = originalSubject.toLowerCase().startsWith('re:')
        ? originalSubject
        : `Re: ${originalSubject}`;
      setSubject(replySubject);
    } else if (mode === 'send') {
      setSubject('');
    }
  }, [latestReceivedEmail, mode]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>이메일 발송</DialogTitle>
        <DialogDescription className='sr-only'>
          이메일을 작성해주세요.
        </DialogDescription>

        <div className='text-xl font-bold mt-2 mb-6'>이메일 발송</div>

        <div className='space-y-4 mb-8'>
          <TemplateDropdown
            onSelect={template => {
              if (mode === 'send') {
                setSubject(template.subject(creatorName));
              }
              setBody(template.body(creatorName));
            }}
          />

          <input
            type='text'
            value={subject}
            onChange={e => {
              setSubject(e.target.value);
              setInvalidField(null);
            }}
            placeholder='제목'
            disabled={mode === 'reply'}
            className={clsx(
              'w-full border p-3 rounded-sm outline-none',
              invalidField === 'subject'
                ? 'border-red-400 animate-shake'
                : mode === 'reply'
                  ? 'border-gray-200 bg-gray-50 text-gray-500'
                  : 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
            )}
          />

          <textarea
            value={body}
            onChange={e => {
              setBody(e.target.value);
              setInvalidField(null);
            }}
            placeholder='본문'
            rows={6}
            className={clsx(
              'w-full border p-3 rounded-sm outline-none resize-none',
              invalidField === 'body'
                ? 'border-red-400 animate-shake'
                : 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
            )}
          />

          {latestReceivedEmail && (
            <label className='flex items-center gap-1.5 text-sm text-gray-900 cursor-pointer -mt-2'>
              <input
                type='checkbox'
                checked={mode === 'reply'}
                onChange={e => setMode(e.target.checked ? 'reply' : 'send')}
                className='w-4 h-4'
              />
              기존 스레드에 답장하기
            </label>
          )}
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

function TemplateDropdown({
  onSelect,
}: {
  onSelect: (template: (typeof OUTREACH_EMAIL_TEMPLATES)[number]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedTemplate = OUTREACH_EMAIL_TEMPLATES.find(
    t => t.id === selectedId
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={clsx(
            'w-full flex justify-between items-center border p-3 rounded-sm outline-none',
            'border-gray-200 hover:border-blue-500',
            selectedTemplate ? 'bg-white' : 'bg-gray-50'
          )}
        >
          <span
            className={selectedTemplate ? 'text-gray-900' : 'text-gray-400'}
          >
            {selectedTemplate?.name ?? '템플릿 선택'}
          </span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </button>
      </PopoverTrigger>

      <PopoverContent className='w-(--radix-popover-trigger-width) p-0 rounded-sm'>
        <Command>
          <CommandEmpty>템플릿이 없습니다.</CommandEmpty>
          <CommandGroup>
            {OUTREACH_EMAIL_TEMPLATES.map(template => (
              <CommandItem
                key={template.id}
                value={template.name}
                onSelect={() => {
                  setSelectedId(template.id);
                  onSelect(template);
                  setOpen(false);
                }}
                className='flex justify-between px-3 py-2 gap-1 cursor-pointer'
              >
                <span>{template.name}</span>
                {selectedId === template.id && (
                  <Check className='h-4 w-4 text-blue-600 -mr-1' />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
