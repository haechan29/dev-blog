import {
  extractHeadings,
  extractPlainText,
} from '@/features/post/domain/lib/parse';
import { PostItemProps } from '@/features/post/ui/postItemProps';

export class Post {
  constructor(
    public readonly slug: string,
    public readonly title: string,
    public readonly date: string,
    public readonly content: string,
    public readonly tags?: string[]
  ) {}

  toProps(): PostItemProps {
    return {
      slug: this.slug,
      title: this.title,
      date: formatDate(this.date),
      tags: this.tags ?? [],
      content: this.content,
      headings: extractHeadings(this.content),
      plainText: extractPlainText(this.content),
    };
  }
}

function formatDate(dateStr: string): string {
  const now = new Date();
  const pDate = new Date(dateStr);
  const timeDiff = now.getTime() - pDate.getTime();

  const [year, month, date] = [
    pDate.getFullYear(),
    pDate.getMonth() + 1,
    pDate.getDate(),
  ];

  if (now.getFullYear() !== year) return `${year}년 ${month}월 ${date}일`;

  const diffInDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  if (diffInDays > 7) return `${month}월 ${date}일`;
  if (diffInDays > 1) return `${diffInDays}일 전`;
  if (diffInDays == 1) return '어제';

  const diffInHours = Math.floor(timeDiff / (1000 * 60 * 60));
  if (diffInHours >= 1) return `${diffInHours}시간 전`;

  return '방금 전';
}
