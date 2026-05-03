import { auth } from '@/auth';
import { UnauthorizedError } from '@/errors/errors';

export async function assertAdmin() {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    throw new UnauthorizedError('인증되지 않은 요청입니다');
  }
}

export async function checkAdmin() {
  const session = await auth();
  const userId = session?.user?.id;
  return userId === process.env.ADMIN_USER_ID;
}
