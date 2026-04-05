import { NotificationDto } from '@/features/notification/data/dto/notificationDto';
import { NotificationProps } from '@/features/notification/ui/model/notificationProps';
import { toUserNickname } from '@/features/user/ui/userProps';
import { formatDateBrief, formatRelativeTime } from '@/lib/date';

const FALLBACK_POST_TITLE = '제목 없음';
const FALLBACK_COMMENT_PREVIEW = '댓글 내용 없음';
const COMMENT_PREVIEW_LIMIT = 120;

function toPostUrl({
  postId,
  highlightCommentId,
}: {
  postId: string | null;
  highlightCommentId?: number | null;
}) {
  if (!postId) {
    return null;
  }

  const params = new URLSearchParams();
  if (highlightCommentId != null) {
    params.set('highlightCommentId', highlightCommentId.toString());
  }
  const qs = params.toString();
  return qs ? `/read/${postId}?${qs}` : `/read/${postId}`;
}

function toPostTitle(title: string | null) {
  const t = title?.trim();
  return t ? t : FALLBACK_POST_TITLE;
}

function toCommentPreview(commentContent: string | null) {
  const previewRaw = commentContent?.trim();
  return previewRaw
    ? previewRaw.slice(0, COMMENT_PREVIEW_LIMIT)
    : FALLBACK_COMMENT_PREVIEW;
}

function formatNotificationTime(isoString: string): string {
  const date = new Date(isoString);
  const diffMs = Date.now() - date.getTime();
  if (diffMs >= 0 && diffMs < 1000 * 60 * 60 * 24) {
    return formatRelativeTime(date);
  }
  return formatDateBrief(isoString);
}

function baseFields(dto: NotificationDto) {
  return {
    id: dto.id,
    isRead: dto.isRead,
    updatedAt: formatNotificationTime(dto.updatedAt),
  };
}

export function toProps(dto: NotificationDto): NotificationProps {
  switch (dto.type) {
    case 'comment': {
      const nickname = toUserNickname({
        id: dto.representativeUserId ?? '0000',
        nickname: dto.representativeUserNickname,
      });
      const total = dto.commentCount ?? 1;
      const primary =
        total > 1
          ? `${nickname}님 외 ${(total - 1).toLocaleString()}명이 댓글을 남겼어요`
          : `${nickname}님이 댓글을 남겼어요`;
      const secondary = toCommentPreview(dto.representativeCommentContent);
      return {
        type: 'comment',
        ...baseFields(dto),
        href: toPostUrl({
          postId: dto.postId,
          highlightCommentId: dto.representativeCommentId,
        }),
        primary,
        secondary,
        representativeNickname: nickname,
        representativeProfileImageUrl: dto.representativeUserProfileImageUrl,
      };
    }
    case 'post_view_milestone': {
      const value = dto.milestoneValue ?? 0;
      return {
        type: 'post_view_milestone',
        ...baseFields(dto),
        href: toPostUrl({ postId: dto.postId }),
        primary: `조회수 ${value.toLocaleString()}회를 돌파했어요`,
        secondary: toPostTitle(dto.postTitle),
      };
    }
    case 'post_like_milestone': {
      const value = dto.milestoneValue ?? 0;
      return {
        type: 'post_like_milestone',
        ...baseFields(dto),
        href: toPostUrl({ postId: dto.postId }),
        primary: `좋아요를 ${value.toLocaleString()}개 받았어요`,
        secondary: toPostTitle(dto.postTitle),
      };
    }
    case 'comment_like_milestone': {
      const value = dto.milestoneValue ?? 0;
      return {
        type: 'comment_like_milestone',
        ...baseFields(dto),
        href: toPostUrl({
          postId: dto.postId,
          highlightCommentId: dto.commentId,
        }),
        primary: `내 댓글이 좋아요 ${value.toLocaleString()}개를 받았어요`,
        secondary: toCommentPreview(dto.commentContent),
      };
    }
    case 'subscriber_milestone': {
      const value = dto.milestoneValue ?? 0;
      return {
        type: 'subscriber_milestone',
        ...baseFields(dto),
        href: null,
        primary: `구독자가 ${value.toLocaleString()}명이 되었어요`,
        secondary: null,
      };
    }
  }
}
