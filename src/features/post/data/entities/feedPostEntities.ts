import { PostEntity } from '@/features/post/data/entities/postEntities';

export interface FeedPostEntity extends Omit<PostEntity, 'password_hash'> {
  post_stats: { popularity: number };
}
