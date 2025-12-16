'use client';

import { fetchPostStat } from '@/features/postStat/domain/service/postStatService';
import { PostStatItemProps } from '@/features/postStat/ui/postStatItemProps';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function usePostStat({ postId }: { postId: string }) {
  const [stat, setStat] = useState<PostStatItemProps>({
    likeCount: 0,
    viewCount: 0,
  });

  const { data } = useQuery({
    queryKey: ['posts', postId, 'stats'],
    queryFn: () => fetchPostStat(postId).then(stat => stat.toProps()),
  });

  useEffect(() => {
    if (data) setStat(data);
  }, [data]);

  return { stat } as const;
}
