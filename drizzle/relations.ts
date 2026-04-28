import {
  accountsInNextAuth,
  comments,
  creators,
  drafts,
  inquiryMessages,
  inquiryThreads,
  media,
  mediaV2,
  mediaVariants,
  notifications,
  outreachEmails,
  postLikes,
  posts,
  postSkips,
  postStats,
  postsV2,
  postViews,
  series,
  sessionsInNextAuth,
  subscriptions,
  users,
  usersInNextAuth,
  usersV2,
} from '@/db/schema';
import { relations } from 'drizzle-orm/relations';

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  notifications_commentId: many(notifications, {
    relationName: 'notifications_commentId_comments_id',
  }),
  notifications_representativeCommentId: many(notifications, {
    relationName: 'notifications_representativeCommentId_comments_id',
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  comments: many(comments),
  notifications: many(notifications),
  series: one(series, {
    fields: [posts.seriesId],
    references: [series.id],
  }),
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  postStats: one(postStats),
  postViews: many(postViews),
  drafts: many(drafts),
  postLikes: many(postLikes),
  postSkips: many(postSkips),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  comments: many(comments),
  series: many(series),
  usersInNextAuth: one(usersInNextAuth, {
    fields: [users.authUserId],
    references: [usersInNextAuth.id],
  }),
  notifications_representativeUserId: many(notifications, {
    relationName: 'notifications_representativeUserId_users_id',
  }),
  notifications_userId: many(notifications, {
    relationName: 'notifications_userId_users_id',
  }),
  posts: many(posts),
  postViews: many(postViews),
  drafts: many(drafts),
  media: many(media),
  creators: many(creators),
  inquiryMessages: many(inquiryMessages),
  inquiryThreads: many(inquiryThreads),
  postsV2s: many(postsV2),
  mediaV2s: many(mediaV2),
  subscriptions_followerId: many(subscriptions, {
    relationName: 'subscriptions_followerId_users_id',
  }),
  subscriptions_followingId: many(subscriptions, {
    relationName: 'subscriptions_followingId_users_id',
  }),
  postLikes: many(postLikes),
  postSkips: many(postSkips),
}));

export const seriesRelations = relations(series, ({ one, many }) => ({
  user: one(users, {
    fields: [series.userId],
    references: [users.id],
  }),
  posts: many(posts),
  postsV2s: many(postsV2),
}));

export const usersInNextAuthRelations = relations(
  usersInNextAuth,
  ({ many }) => ({
    users: many(users),
    accountsInNextAuths: many(accountsInNextAuth),
    sessionsInNextAuths: many(sessionsInNextAuth),
    usersV2s: many(usersV2),
  })
);

export const accountsInNextAuthRelations = relations(
  accountsInNextAuth,
  ({ one }) => ({
    usersInNextAuth: one(usersInNextAuth, {
      fields: [accountsInNextAuth.userId],
      references: [usersInNextAuth.id],
    }),
  })
);

export const sessionsInNextAuthRelations = relations(
  sessionsInNextAuth,
  ({ one }) => ({
    usersInNextAuth: one(usersInNextAuth, {
      fields: [sessionsInNextAuth.userId],
      references: [usersInNextAuth.id],
    }),
  })
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  comment_commentId: one(comments, {
    fields: [notifications.commentId],
    references: [comments.id],
    relationName: 'notifications_commentId_comments_id',
  }),
  inquiryThread: one(inquiryThreads, {
    fields: [notifications.inquiryThreadId],
    references: [inquiryThreads.id],
  }),
  post: one(posts, {
    fields: [notifications.postId],
    references: [posts.id],
  }),
  comment_representativeCommentId: one(comments, {
    fields: [notifications.representativeCommentId],
    references: [comments.id],
    relationName: 'notifications_representativeCommentId_comments_id',
  }),
  user_representativeUserId: one(users, {
    fields: [notifications.representativeUserId],
    references: [users.id],
    relationName: 'notifications_representativeUserId_users_id',
  }),
  user_userId: one(users, {
    fields: [notifications.userId],
    references: [users.id],
    relationName: 'notifications_userId_users_id',
  }),
}));

export const inquiryThreadsRelations = relations(
  inquiryThreads,
  ({ one, many }) => ({
    notifications: many(notifications),
    inquiryMessages: many(inquiryMessages),
    user: one(users, {
      fields: [inquiryThreads.userId],
      references: [users.id],
    }),
  })
);

export const outreachEmailsRelations = relations(outreachEmails, ({ one }) => ({
  creator: one(creators, {
    fields: [outreachEmails.creatorId],
    references: [creators.id],
  }),
}));

export const creatorsRelations = relations(creators, ({ one, many }) => ({
  outreachEmails: many(outreachEmails),
  user: one(users, {
    fields: [creators.userId],
    references: [users.id],
  }),
}));

export const postStatsRelations = relations(postStats, ({ one }) => ({
  post: one(posts, {
    fields: [postStats.postId],
    references: [posts.id],
  }),
}));

export const postViewsRelations = relations(postViews, ({ one }) => ({
  post: one(posts, {
    fields: [postViews.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postViews.userId],
    references: [users.id],
  }),
}));

export const draftsRelations = relations(drafts, ({ one }) => ({
  post: one(posts, {
    fields: [drafts.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [drafts.userId],
    references: [users.id],
  }),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  user: one(users, {
    fields: [media.userId],
    references: [users.id],
  }),
}));

export const inquiryMessagesRelations = relations(
  inquiryMessages,
  ({ one }) => ({
    user: one(users, {
      fields: [inquiryMessages.senderId],
      references: [users.id],
    }),
    inquiryThread: one(inquiryThreads, {
      fields: [inquiryMessages.threadId],
      references: [inquiryThreads.id],
    }),
  })
);

export const postsV2Relations = relations(postsV2, ({ one }) => ({
  series: one(series, {
    fields: [postsV2.seriesId],
    references: [series.id],
  }),
  user: one(users, {
    fields: [postsV2.userId],
    references: [users.id],
  }),
}));

export const mediaVariantsRelations = relations(mediaVariants, ({ one }) => ({
  mediaV2: one(mediaV2, {
    fields: [mediaVariants.mediaId],
    references: [mediaV2.id],
  }),
}));

export const mediaV2Relations = relations(mediaV2, ({ one, many }) => ({
  mediaVariants: many(mediaVariants),
  user: one(users, {
    fields: [mediaV2.userId],
    references: [users.id],
  }),
  usersV2s: many(usersV2),
}));

export const usersV2Relations = relations(usersV2, ({ one }) => ({
  usersInNextAuth: one(usersInNextAuth, {
    fields: [usersV2.authUserId],
    references: [usersInNextAuth.id],
  }),
  mediaV2: one(mediaV2, {
    fields: [usersV2.profileImageId],
    references: [mediaV2.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user_followerId: one(users, {
    fields: [subscriptions.followerId],
    references: [users.id],
    relationName: 'subscriptions_followerId_users_id',
  }),
  user_followingId: one(users, {
    fields: [subscriptions.followingId],
    references: [users.id],
    relationName: 'subscriptions_followingId_users_id',
  }),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
}));

export const postSkipsRelations = relations(postSkips, ({ one }) => ({
  post: one(posts, {
    fields: [postSkips.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postSkips.userId],
    references: [users.id],
  }),
}));
