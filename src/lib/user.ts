import { auth } from '@/auth';
import { cookies } from 'next/headers';
import 'server-only';

export async function getUserId() {
  const session = await auth();
  return session?.user?.id ?? (await cookies()).get('userId')?.value;
}
