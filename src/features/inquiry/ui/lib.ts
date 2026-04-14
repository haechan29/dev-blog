import { InquiryMessageDto } from '@/features/inquiry/data/dto/inquiryMessageDto';
import { InquiryMessageProps } from '@/features/inquiry/ui/model/inquiryMessageProps';

const THREAD_PROMPT_MESSAGE_ID = 'THREAD_PROMPT_MESSAGE_ID';
const THREAD_PROMPT_MESSAGE_CONTENT =
  '언제든 편하게 문의를 남겨주세요. 꼭 확인할게요.';

function localDateKey(iso: string): string {
  const d = new Date(iso);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

function localTimeKey(iso: string): string {
  const d = new Date(iso);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
    String(d.getHours()).padStart(2, '0'),
    String(d.getMinutes()).padStart(2, '0'),
  ].join('-');
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function buildThreadPromptMessage(anchorIso: string): InquiryMessageDto {
  return {
    id: THREAD_PROMPT_MESSAGE_ID,
    senderType: 'ADMIN',
    createdAt: anchorIso,
    isDeleted: false,
    content: THREAD_PROMPT_MESSAGE_CONTENT,
    imageUrls: [],
  };
}

export function toPropsList(dtos: InquiryMessageDto[]): InquiryMessageProps[] {
  const threadPromptMessageCreatedAt = dtos[0]
    ? new Date(dtos[0].createdAt).toISOString()
    : new Date().toISOString();
  const messages = [
    buildThreadPromptMessage(threadPromptMessageCreatedAt),
    ...dtos,
  ];

  return messages.map((message, index) => {
    const isPromptMessage = index === 0;
    const showDate =
      isPromptMessage ||
      localDateKey(message.createdAt) !==
        localDateKey(messages[index - 1].createdAt);
    const showTime =
      !isPromptMessage &&
      (index === messages.length - 1 ||
        localTimeKey(message.createdAt) !==
          localTimeKey(messages[index + 1].createdAt));
    return {
      id: message.id,
      senderType: message.senderType,
      createdAt: message.createdAt,
      isDeleted: message.isDeleted,
      content: message.content,
      imageUrls: message.imageUrls,
      showDate,
      dateLabel: formatDate(message.createdAt),
      showTime,
      timeLabel: formatTime(message.createdAt),
    };
  });
}
