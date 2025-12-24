export const postKeys = {
  list: (excludeId?: string) =>
    excludeId ? (['posts', { excludeId }] as const) : (['posts'] as const),
  detail: (id: string) => ['posts', id] as const,
  search: (query: string, limit: number, infinite = false) =>
    ['posts', 'search', { query, limit, infinite }] as const,
  comments: (postId: string) => ['posts', postId, 'comments'] as const,
  like: (postId: string) => ['posts', postId, 'like'] as const,
};

export const userKeys = {
  me: () => ['user'] as const,
  posts: (userId: string) => ['user', userId, 'posts'] as const,
  seriesList: (userId: string) => ['user', userId, 'series'] as const,
  series: (userId: string, seriesId: string) =>
    ['user', userId, 'series', seriesId] as const,
};

export const subscriptionKeys = {
  info: (userId: string) => ['subscriptions', userId] as const,
  followers: (userId: string) =>
    ['subscriptions', userId, 'followers'] as const,
  following: (userId: string) =>
    ['subscriptions', userId, 'following'] as const,
};
