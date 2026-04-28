import { db } from '@/db/index';
import { tags } from '@/db/schema';
import { asc, desc, ilike } from 'drizzle-orm';
import 'server-only';

const TAG_LIMIT = 10;

export async function fetchTagNames(query: string): Promise<string[]> {
  const where = query.length > 0 ? ilike(tags.name, `%${query}%`) : undefined;

  const data = await db
    .select({ name: tags.name })
    .from(tags)
    .where(where)
    .orderBy(desc(tags.postCount), asc(tags.name))
    .limit(TAG_LIMIT);

  return data.map(tag => tag.name);
}
