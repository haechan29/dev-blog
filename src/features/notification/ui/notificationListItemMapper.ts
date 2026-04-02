import { NotificationDto } from '@/features/notification/data/dto/notificationDto';
import { NotificationListItemUi } from '@/features/notification/ui/notificationListItemUiModel';

function postHref(postId: string | null): string | null {
  return postId ? `/read/${postId}` : null;
}

function postLabel(title: string | null): string {
  return title ? `「${title}」` : '게시글';
}

export function mapNotificationDtoToListItemUi(
  dto: NotificationDto
): NotificationListItemUi {
  switch (dto.type) {
    case 'comment': {
      const nickname = dto.representativeUserNickname ?? '누군가';
      const post = postLabel(dto.postTitle);
      const count = dto.commentCount ?? 1;
      const primary =
        count > 1
          ? `${nickname}님 외 ${count - 1}명이 ${post}에 댓글을 남겼습니다`
          : `${nickname}님이 ${post}에 댓글을 남겼습니다`;
      const secondary =
        dto.representativeCommentContent?.trim().slice(0, 120) || null;
      return {
        kind: 'comment',
        id: dto.id,
        primary,
        secondary,
        href: postHref(dto.postId),
      };
    }
    case 'post_view_milestone': {
      const post = postLabel(dto.postTitle);
      const value = dto.milestoneValue ?? 0;
      return {
        kind: 'post_view_milestone',
        id: dto.id,
        primary: `${post} 조회수 ${value.toLocaleString()}회를 달성했습니다`,
        secondary: null,
        href: postHref(dto.postId),
      };
    }
    case 'post_like_milestone': {
      const post = postLabel(dto.postTitle);
      const value = dto.milestoneValue ?? 0;
      return {
        kind: 'post_like_milestone',
        id: dto.id,
        primary: `${post} 좋아요 ${value.toLocaleString()}개를 달성했습니다`,
        secondary: null,
        href: postHref(dto.postId),
      };
    }
    case 'comment_like_milestone': {
      const post = postLabel(dto.postTitle);
      const value = dto.milestoneValue ?? 0;
      const preview =
        dto.representativeCommentContent?.trim().slice(0, 80) ?? null;
      return {
        kind: 'comment_like_milestone',
        id: dto.id,
        primary: `${post} 댓글에 좋아요 ${value.toLocaleString()}개를 달성했습니다`,
        secondary: preview,
        href: postHref(dto.postId),
      };
    }
    case 'subscriber_milestone': {
      const value = dto.milestoneValue ?? 0;
      return {
        kind: 'subscriber_milestone',
        id: dto.id,
        primary: `구독자 ${value.toLocaleString()}명을 달성했습니다`,
        secondary: null,
        href: null,
      };
    }
  }
}
