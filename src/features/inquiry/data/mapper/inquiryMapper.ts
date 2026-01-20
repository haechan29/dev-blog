import { InquiryEntity } from '@/features/inquiry/data/entities/inquiryEntities';
import { Inquiry } from '@/features/inquiry/domain/model/inquiry';

export function toDomain(entity: InquiryEntity): Inquiry {
  return {
    id: entity.id,
    userId: entity.user_id,
    content: entity.content,
    createdAt: formatDate(entity.created_at),
    createdAtBrief: formatDateBrief(entity.created_at),
    nickname: entity.users?.nickname ?? null,
  };
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function formatDateBrief(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffDays = Math.floor(
    (startOfToday.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  if (diffDays === 1) {
    const hours = String(date.getHours()).padStart(2, '0');
    return `어제 ${hours}시`;
  }

  if (diffDays <= 6) {
    return `${diffDays}일 전`;
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (year === now.getFullYear()) {
    return `${month}월 ${day}일`;
  }

  return `${year}년 ${month}월 ${day}일`;
}
