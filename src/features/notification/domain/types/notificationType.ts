const NOTIFICATION_TYPES = [
  'comment',
  'post_view_milestone',
  'post_like_milestone',
  'comment_like_milestone',
  'subscriber_milestone',
  'inquiry_reply',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export function isNotificationType(type: string): type is NotificationType {
  return NOTIFICATION_TYPES.includes(type as NotificationType);
}

export function toNotificationType(type: string): NotificationType {
  if (!isNotificationType(type)) {
    throw new Error(`형식이 올바르지 않습니다: ${type}`);
  }
  return type;
}
