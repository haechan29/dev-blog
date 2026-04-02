import { NotificationType } from '@/features/notification/domain/types/notificationType';

interface NotificationPropsBase {
  type: NotificationType;
  id: string;
  isRead: boolean;
  updatedAt: string;
  href: string | null;
  primary: string;
  secondary: string | null;
}

export interface PostViewMilestoneNotificationProps extends NotificationPropsBase {
  type: 'post_view_milestone';
}

export interface PostLikesMilestoneNotificationProps extends NotificationPropsBase {
  type: 'post_like_milestone';
}

export interface CommentLikeMilestoneNotificationProps extends NotificationPropsBase {
  type: 'comment_like_milestone';
}

export interface SubscriberMilestoneNotificationProps extends NotificationPropsBase {
  type: 'subscriber_milestone';
}

export interface CommentNotificationProps extends NotificationPropsBase {
  type: 'comment';
  representativeNickname: string;
  representativeProfileImageUrl: string | null;
}

export type NotificationProps =
  | PostViewMilestoneNotificationProps
  | PostLikesMilestoneNotificationProps
  | CommentLikeMilestoneNotificationProps
  | SubscriberMilestoneNotificationProps
  | CommentNotificationProps;
