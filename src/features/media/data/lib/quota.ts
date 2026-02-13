import {
  DailyQuotaExhaustedError,
  RateLimitError,
} from '@/features/media/data/errors/mediaErrors';
import * as MediaQueries from '@/features/media/data/queries/mediaQueries';

const LIMIT_PER_MINUTE = 100 * 1024 * 1024; // 100MB
const DAILY_QUOTA = 1024 * 1024 * 1024; // 1GB

export async function checkQuota(userId: string, fileSize: number) {
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [usageLastMinute, usageLastDay] = await Promise.all([
    MediaQueries.getUsageSince(userId, oneMinuteAgo),
    MediaQueries.getUsageSince(userId, oneDayAgo),
  ]);

  if (usageLastMinute + fileSize > LIMIT_PER_MINUTE) {
    throw new RateLimitError('1분 후에 다시 시도해주세요');
  }

  if (usageLastDay + fileSize > DAILY_QUOTA) {
    console.log('일일 사용량 초과', userId);
    throw new DailyQuotaExhaustedError('오늘 사용량을 모두 사용했습니다');
  }
}
