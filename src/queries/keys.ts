export const draftKeys = {
  list: () => ['drafts'] as const,
};

export const tagKeys = {
  search: (query: string) => ['tags', 'search', { query }] as const,
};

export const postKeys = {
  list: (params?: { excludeId?: string; tag?: string }) => {
    const filters = {
      ...(params?.excludeId && { excludeId: params.excludeId }),
      ...(params?.tag && { tag: params.tag }),
    };
    return Object.keys(filters).length > 0
      ? (['posts', 'list', filters] as const)
      : (['posts', 'list'] as const);
  },
  detail: (id: string) => ['posts', id] as const,
  search: (query: string, infinite = false) =>
    ['posts', 'search', { query, infinite }] as const,
  comments: (postId: string, highlightCommentId: number | null = null) =>
    ['posts', postId, 'comments', { highlightCommentId }] as const,
  like: (postId: string) => ['posts', postId, 'like'] as const,
};

export const userKeys = {
  me: () => ['user'] as const,
  user: (userId: string) => ['user', userId] as const,
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

export const notificationKeys = {
  unreadCount: () => ['notifications', 'unread-count'] as const,
  list: () => ['notifications', 'list'] as const,
};
