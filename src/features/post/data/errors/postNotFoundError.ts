export class PostNotFoundError extends Error {
  constructor(postId: string) {
    super(`게시글이 존재하지 않습니다. postId: ${postId}`);
    this.name = 'PostNotFoundError';
  }
}
