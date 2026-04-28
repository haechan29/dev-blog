import { db } from '@/db/index';
import { users } from '@/db/schema';
import { InferInsertModel, eq } from 'drizzle-orm';
import 'server-only';

export async function updateProfile({
  userId,
  profileImageUrl,
  bio,
}: {
  userId: string;
  profileImageUrl?: string | null;
  bio?: string | null;
}) {
  const updates: Partial<InferInsertModel<typeof users>> = {
    ...(profileImageUrl !== undefined && { profileImageUrl }),
    ...(bio !== undefined && { bio }),
  };

  await db.update(users).set(updates).where(eq(users.id, userId));
}
