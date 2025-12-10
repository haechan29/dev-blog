'use server';

import * as UserServerService from '@/features/user/domain/service/userServerService';
import { cookies } from 'next/headers';

export async function createUser() {
  try {
    const userId = await UserServerService.createUser();

    const cookieStore = await cookies();
    cookieStore.set('userId', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    });
  } catch (error) {
    console.error('유저 생성에 실패했습니다', error);

    throw error;
  }
}
