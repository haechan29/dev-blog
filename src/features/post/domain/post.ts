import { PostItemProps } from '@/features/post/ui/postItemProps'

export class Post {
  constructor (
    public readonly slug: string,
    public readonly title: string,
    public readonly date: string,
    public readonly content: string,
    public readonly tags?: string[]
  ) {}

  private extractPlainText(): string {
    return this.content
      .replace(/^---[\s\S]*?---/m, '') // frontmatter 제거
      .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
      .replace(/`[^`]*`/g, '') // 인라인 코드 제거
      .replace(/<[^>]*>/g, '') // JSX 태그 제거
      .replace(/#{1,6}\s+/g, '') // 헤딩 # 제거
      .replace(/\*\*(.*?)\*\*/g, '$1') // **굵게** 제거
      .replace(/\*(.*?)\*/g, '$1') // *기울임* 제거
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 링크 제거
      .replace(/\n+/g, ' ') // 개행 제거
      .trim()
      .substring(0, 150); // 150자로 제한
  }

  toProps(): PostItemProps {
    return {
      slug: this.slug,
      title: this.title,
      date: this.date,
      tags: this.tags ?? [],
      content: this.content,
      plainText: this.extractPlainText()
    };
  }
}