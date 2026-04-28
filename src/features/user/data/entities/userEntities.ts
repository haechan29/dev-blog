import type * as UserQueries from '@/features/user/data/queries/userQueries';

export type UserEntity = NonNullable<
  Awaited<ReturnType<typeof UserQueries.fetchUser>>
>;
