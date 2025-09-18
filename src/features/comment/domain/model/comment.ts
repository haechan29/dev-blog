import { CommentItemProps } from '@/features/comment/ui/commentItemProps';

export class Comment {
  constructor(
    public readonly id: number,
    public readonly postId: string,
    public readonly authorName: string,
    public readonly content: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly likeCount: number
  ) {}

  toProps(): CommentItemProps {
    return {
      id: this.id,
      postId: this.postId,
      authorName: this.authorName,
      content: this.content,
      createdAt: formatTime(this.createdAt),
      isUpdated: this.createdAt !== this.updatedAt,
      likeCount: this.likeCount,
    };
  }
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
