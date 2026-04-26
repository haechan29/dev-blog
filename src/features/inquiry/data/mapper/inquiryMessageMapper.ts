import { DELETED_MESSAGE_CONTENT } from '@/features/inquiry/constants/inquiryMessage';
import { InquiryMessageDto } from '@/features/inquiry/data/dto/inquiryMessageDto';
import { InquiryMessageEntity } from '@/features/inquiry/data/entities/inquiryMessageEntities';
import { InquiryMessageSenderType } from '@/features/inquiry/domain/types/inquiryMessageSenderType';

function toSenderType(value: string): InquiryMessageSenderType {
  return value === 'ADMIN' ? 'ADMIN' : 'USER';
}

export function toDto(
  entity: InquiryMessageEntity,
  urlById: Map<string, string>
): InquiryMessageDto {
  if (entity.isDeleted) {
    return {
      id: entity.id,
      senderType: toSenderType(entity.senderType),
      createdAt: entity.createdAt,
      content: DELETED_MESSAGE_CONTENT,
      imageUrls: [],
      isDeleted: true,
    };
  }

  const ids = entity.images ?? [];
  const imageUrls = ids
    .map(id => urlById.get(id))
    .filter((url): url is string => url != null);

  return {
    id: entity.id,
    senderType: toSenderType(entity.senderType),
    createdAt: entity.createdAt,
    content: entity.content,
    imageUrls,
    isDeleted: false,
  };
}
