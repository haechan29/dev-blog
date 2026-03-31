import { cached } from '@/lib/cache';
import { supabase } from '@/lib/supabase';
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
      const { data, error } = await supabase
        .from('milestone_thresholds')
        .select('threshold')
        .eq('type', type)
        .order('threshold', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []).map(row => row.threshold);
    },
    MILESTONE_THRESHOLD_CACHE_TTL_MS
  );
}
