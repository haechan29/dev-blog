import { auth } from '@/auth';
import { UnauthorizedError } from '@/errors/errors';

export async function assertAdmin() {
  const session = await auth();

  if (session?.user?.user_id !== process.env.ADMIN_USER_ID) {
    throw new UnauthorizedError('인증되지 않은 요청입니다');
  }
}
