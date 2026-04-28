import { db } from '@/db/index';
import { posts, series } from '@/db/schema';
import { NotFoundError } from '@/errors/errors';
import { and, asc, desc, eq } from 'drizzle-orm';
import 'server-only';

export async function fetchSeries(seriesId: string) {
  const entity = await db.query.series.findFirst({
    where: eq(series.id, seriesId),
    columns: {
      id: true,
      title: true,
      description: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
    with: {
      user: {
        columns: {
          nickname: true,
          profileImageUrl: true,
        },
      },
      posts: {
        columns: {
          id: true,
          title: true,
          createdAt: true,
          seriesId: true,
          seriesOrder: true,
          visibility: true,
        },
        with: {
          postStats: {
            columns: {
              likeCount: true,
              viewCount: true,
              commentCount: true,
            },
          },
        },
        orderBy: [asc(posts.seriesOrder)],
      },
    },
  });

  if (!entity) {
    throw new NotFoundError('시리즈를 찾을 수 없습니다');
  }

  return entity;
}

export async function fetchSeriesByUserId(userId: string) {
  return await db.query.series.findMany({
    where: eq(series.userId, userId),
    columns: {
      id: true,
      title: true,
      description: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
    with: {
      user: {
        columns: {
          nickname: true,
          profileImageUrl: true,
        },
      },
      posts: {
        columns: {
          id: true,
          title: true,
          createdAt: true,
          seriesId: true,
          seriesOrder: true,
          visibility: true,
        },
        with: {
          postStats: {
            columns: {
              likeCount: true,
              viewCount: true,
              commentCount: true,
            },
          },
        },
        orderBy: [asc(posts.seriesOrder)],
      },
    },
    orderBy: [desc(series.createdAt)],
  });
}

export async function createSeries({
  title,
  description,
  userId,
}: {
  title: string;
  description: string | null;
  userId: string;
}) {
  const [createdSeries] = await db
    .insert(series)
    .values({
      title,
      description,
      userId,
    })
    .returning({ id: series.id });

  if (!createdSeries) {
    throw new Error('시리즈 생성에 실패했습니다');
  }

  return { id: createdSeries.id };
}

export async function updateSeries({
  seriesId,
  title,
  description,
  userId,
}: {
  seriesId: string;
  title: string;
  description: string | null;
  userId: string;
}) {
  const [updatedSeries] = await db
    .update(series)
    .set({
      title,
      description,
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(series.id, seriesId), eq(series.userId, userId)))
    .returning({ id: series.id });

  if (!updatedSeries) {
    throw new NotFoundError('시리즈를 찾을 수 없습니다');
  }

  return await fetchSeries(updatedSeries.id);
}

export async function deleteSeries(seriesId: string, userId: string) {
  await db
    .delete(series)
    .where(and(eq(series.id, seriesId), eq(series.userId, userId)));
}
