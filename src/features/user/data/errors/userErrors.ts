export class DuplicateNicknameError extends Error {
  constructor(nickname: string) {
    super(`이미 사용 중인 닉네임입니다: ${nickname}`);
    this.name = 'DuplicateNicknameError';
  }
}
