export default class PostStat {
  constructor(
    public readonly id: string,
    public readonly postId: string,
    public readonly likeCount: number,
    public readonly commentCount: number,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}
}
