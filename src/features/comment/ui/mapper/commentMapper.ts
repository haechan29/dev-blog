import { CommentResponseDto } from '@/features/comment/data/dto/commentResponseDto';
import { CommentItemProps } from '@/features/comment/ui/props/commentItemProps';
import { toUserNickname } from '@/features/user/ui/userProps';

export function toProps(comment: CommentResponseDto): CommentItemProps {
  return {
    id: comment.id,
    postId: comment.postId,
    authorName: toUserNickname({
      id: comment.userId,
      nickname: comment.user.nickname,
    }),
    profileImageUrl: comment.user.profileImageUrl,
    content: comment.content,
    createdAt: formatTime(comment.createdAt),
    isUpdated: comment.createdAt !== comment.updatedAt,
    likeCount: comment.likeCount,
    userId: comment.userId,
  };
}

function formatTime(dateStr: string) {
  const now = new Date();
  const pDate = new Date(dateStr);

  const timeDiff = now.getTime() - pDate.getTime();
  const diffInDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  const [year, month, date] = [
    pDate.getFullYear(),
    pDate.getMonth() + 1,
    pDate.getDate(),
  ];

  if (diffInDays > 7) return `${year}년 ${month}월 ${date}일`;

  if (diffInDays > 1) return `${diffInDays}일 전`;
  if (diffInDays == 1) return '어제';

  const diffInHours = Math.floor(timeDiff / (1000 * 60 * 60));
  if (diffInHours >= 1) return `${diffInHours}시간 전`;

  const diffInMinutes = Math.floor(timeDiff / (1000 * 60));
  if (diffInMinutes >= 1) return `${diffInMinutes}분 전`;

  return '방금 전';
}
