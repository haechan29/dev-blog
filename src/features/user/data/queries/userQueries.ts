import { db } from '@/db/index';
import { users } from '@/db/schema';
import { isUniqueViolation } from '@/errors/lib';
import { DuplicateNicknameError } from '@/features/user/data/errors/userErrors';
import { supabaseNextAuth } from '@/lib/supabase';
import { InferInsertModel, eq } from 'drizzle-orm';
import 'server-only';

const USER_SELECT_FIELDS = {
  id: users.id,
  nickname: users.nickname,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
  deletedAt: users.deletedAt,
  registeredAt: users.registeredAt,
  profileImageUrl: users.profileImageUrl,
  bio: users.bio,
  subscriberCount: users.subscriberCount,
} as const;

export async function fetchUser(userId: string) {
  const entities = await db
    .select(USER_SELECT_FIELDS)
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return entities[0] ?? null;
}

export async function createUser(nickname: string | null = null) {
  const [createdUser] = await db
    .insert(users)
    .values({ nickname, authUserId: null })
    .returning({ id: users.id });

  if (!createdUser) {
    throw new Error('사용자 생성에 실패했습니다');
  }

  return createdUser.id;
}

export async function updateUser({
  userId,
  userIdFromSession,
  nickname,
  subscriberCount,
  registeredAt,
  deletedAt,
}: {
  userId: string;
  userIdFromSession?: string;
  nickname?: string | null;
  subscriberCount?: number;
  registeredAt?: string | null;
  deletedAt?: string | null;
}) {
  const updates: Partial<InferInsertModel<typeof users>> = {
    ...(nickname !== undefined && { nickname }),
    ...(userIdFromSession !== undefined && { authUserId: userIdFromSession }),
    ...(subscriberCount !== undefined && { subscriberCount }),
    ...(registeredAt !== undefined && { registeredAt }),
    ...(deletedAt !== undefined && { deletedAt }),
  };

  try {
    await db.update(users).set(updates).where(eq(users.id, userId));
  } catch (error) {
    if (nickname && isUniqueViolation(error)) {
      throw new DuplicateNicknameError(nickname);
    }
    throw error;
  }
}

export async function deleteUserFromAuth(userIdFromSession: string) {
  const { error } = await supabaseNextAuth
    .from('users')
    .delete()
    .eq('id', userIdFromSession);

  if (error) {
    throw new Error(error.message);
  }
}
