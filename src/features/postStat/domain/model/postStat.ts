import { PostStatItemProps } from '@/features/postStat/ui/postStatItemProps';

export default class PostStat {
  constructor(
    public readonly id: string,
    public readonly postId: string,
    public readonly likeCount: number,
    public readonly viewCount: number
  ) {}

  toProps(): PostStatItemProps {
    return {
      id: this.id,
      postId: this.postId,
      likeCount: this.likeCount,
      viewCount: this.viewCount,
    };
  }
}
