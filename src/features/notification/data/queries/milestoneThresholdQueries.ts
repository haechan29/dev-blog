import { db } from '@/db/index';
import { milestoneThresholds } from '@/db/schema';
import { cached } from '@/lib/cache';
import { asc, eq } from 'drizzle-orm';
import 'server-only';

export type MilestoneThresholdType =
  | 'post_view'
  | 'post_like'
  | 'comment_like'
  | 'subscriber';

const MILESTONE_THRESHOLD_CACHE_TTL_MS = 5 * 60 * 1000;

export async function fetchMilestoneThresholds(
  type: MilestoneThresholdType
): Promise<number[]> {
  return cached(
    type,
    async () => {
      const data = await db
        .select({ threshold: milestoneThresholds.threshold })
        .from(milestoneThresholds)
        .where(eq(milestoneThresholds.type, type))
        .orderBy(asc(milestoneThresholds.threshold));

      return data.map(row => row.threshold);
    },
    MILESTONE_THRESHOLD_CACHE_TTL_MS
  );
}
