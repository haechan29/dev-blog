export class PostStatCreationError extends Error {
  constructor(public readonly postId: string) {
    super(`게시글 통계 생성 실패: ${postId}`);
    this.name = 'PostStatCreationError';
  }
}
