export class PostStatCreationError extends Error {
  constructor(message: string, public readonly postId: string) {
    super(message);
    this.name = 'PostStatCreationError';
  }
}
