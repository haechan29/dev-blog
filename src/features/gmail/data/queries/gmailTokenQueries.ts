import { db } from '@/db/index';
import { gmailTokens } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import 'server-only';

const DEFAULT_ID = 'default';

export async function fetchGmailTokenByDefaultId() {
  const rows = await db
    .select()
    .from(gmailTokens)
    .where(eq(gmailTokens.id, DEFAULT_ID))
    .limit(1);
  return rows[0] ?? null;
}

export async function upsertGmailTokens(input: {
  accessToken: string;
  refreshToken: string | undefined;
  expiresAtIso: string;
}) {
  const now = new Date().toISOString();
  await db
    .insert(gmailTokens)
    .values({
      id: DEFAULT_ID,
      accessToken: input.accessToken,
      refreshToken: input.refreshToken ?? null,
      expiresAt: input.expiresAtIso,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: gmailTokens.id,
      set: {
        accessToken: input.accessToken,
        expiresAt: input.expiresAtIso,
        updatedAt: now,
        refreshToken: input.refreshToken
          ? input.refreshToken
          : sql`${gmailTokens.refreshToken}`,
      },
    });
}

export async function updateGmailAccessToken(input: {
  accessToken: string;
  expiresAtIso: string;
}) {
  const now = new Date().toISOString();
  await db
    .update(gmailTokens)
    .set({
      accessToken: input.accessToken,
      expiresAt: input.expiresAtIso,
      updatedAt: now,
    })
    .where(eq(gmailTokens.id, DEFAULT_ID));
}
