export const postsKeys = {
  list: (excludeId?: string) =>
    excludeId ? (['posts', { excludeId }] as const) : (['posts'] as const),
  detail: (id: string) => ['posts', id] as const,
  search: (query: string, limit: number, infinite = false) =>
    ['posts', 'search', { query, limit, infinite }] as const,
};

export const usersKeys = {
  posts: (userId: string) => ['user', userId, 'posts'] as const,
  seriesList: (userId: string) => ['user', userId, 'series'] as const,
  series: (userId: string, seriesId: string) =>
    ['user', userId, 'series', seriesId] as const,
};
