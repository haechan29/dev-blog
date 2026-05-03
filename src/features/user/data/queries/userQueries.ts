import { db } from '@/db/index';
import { accounts, sessions, users } from '@/db/schema';
import { isUniqueViolation } from '@/errors/lib';
import { DuplicateNicknameError } from '@/features/user/data/errors/userErrors';
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

const USER_AUTH_INFO_SELECT_FIELDS = {
  id: users.id,
  email: users.email,
  emailVerified: users.emailVerified,
} as const;

export async function fetchUser(userId: string) {
  const entities = await db
    .select(USER_SELECT_FIELDS)
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return entities[0] ?? null;
}

export async function fetchUserAuthInfo(userId: string) {
  const entities = await db
    .select(USER_AUTH_INFO_SELECT_FIELDS)
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return entities[0] ?? null;
}

export async function createUser(nickname: string | null = null) {
  const [createdUser] = await db
    .insert(users)
    .values({ nickname })
    .returning({ id: users.id });

  if (!createdUser) {
    throw new Error('사용자 생성에 실패했습니다');
  }

  return createdUser.id;
}

export async function updateUser({
  userId,
  nickname,
  subscriberCount,
  registeredAt,
  deletedAt,
  name,
  email,
  emailVerified,
}: {
  userId: string;
  nickname?: string | null;
  subscriberCount?: number;
  registeredAt?: string | null;
  deletedAt?: string | null;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
}) {
  const updates: Partial<InferInsertModel<typeof users>> = {
    ...(nickname !== undefined && { nickname }),
    ...(subscriberCount !== undefined && { subscriberCount }),
    ...(registeredAt !== undefined && { registeredAt }),
    ...(deletedAt !== undefined && { deletedAt }),
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...(emailVerified !== undefined && { emailVerified }),
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

export async function softDeleteUser(userId: string) {
  const now = new Date().toISOString();

  await db.transaction(async tx => {
    await tx.delete(sessions).where(eq(sessions.userId, userId));
    await tx.delete(accounts).where(eq(accounts.userId, userId));

    await tx
      .update(users)
      .set({
        nickname: null,
        deletedAt: now,
        name: null,
        email: null,
        emailVerified: null,
        image: null,
      })
      .where(eq(users.id, userId));
  });
}
