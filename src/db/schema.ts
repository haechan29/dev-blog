import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  jsonb,
  numeric,
  pgPolicy,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const comments = pgTable(
  'comments',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    postId: uuid('post_id').notNull(),
    passwordHash: text('password_hash'),
    content: text().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    likeCount: integer('like_count').default(0).notNull(),
    userId: uuid('user_id').notNull(),
  },
  table => [
    index('idx_comments_post_id').using(
      'btree',
      table.postId.asc().nullsLast()
    ),
    index('idx_comments_user_id').using(
      'btree',
      table.userId.asc().nullsLast()
    ),
    foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
      name: 'comments_post_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'comments_user_id_fkey',
    }).onDelete('cascade'),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
    check('comments_content_length', sql`char_length(content) <= 3000`),
  ]
);

export const series = pgTable(
  'series',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    title: text().notNull(),
    description: text(),
    userId: uuid('user_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  table => [
    index('idx_series_user_id').using(
      'btree',
      table.userId.asc().nullsLast()
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'series_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
    check('series_description_length', sql`char_length(description) <= 500`),
    check('series_title_check', sql`char_length(title) <= 100`),
  ]
);

export const tags = pgTable(
  'tags',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    postCount: integer('post_count').default(0).notNull(),
  },
  table => [
    index('idx_tags_name_trgm').using(
      'gin',
      table.name.asc().nullsLast().op('gin_trgm_ops')
    ),
    unique('tags_name_key').on(table.name),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
  ]
);

export const users = pgTable(
  'users',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    nickname: text(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
    registeredAt: timestamp('registered_at', {
      withTimezone: true,
      mode: 'string',
    }),
    profileImageUrl: text('profile_image_url'),
    bio: text(),
    subscriberCount: integer('subscriber_count').default(0).notNull(),
    name: text(),
    email: text(),
    emailVerified: timestamp('email_verified', { withTimezone: true }),
    image: text(),
  },
  table => [
    uniqueIndex('users_email_unique')
      .using('btree', table.email.asc().nullsLast())
      .where(sql`(email IS NOT NULL)`),
    uniqueIndex('users_nickname_unique')
      .using('btree', table.nickname.asc().nullsLast())
      .where(sql`(deleted_at IS NULL)`),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
    check(
      'users_bio_length_check',
      sql`(bio IS NULL) OR (char_length(bio) <= 200)`
    ),
    check(
      'users_nickname_length_check',
      sql`(char_length(nickname) >= 1) AND (char_length(nickname) <= 50)`
    ),
  ]
);

export const milestoneThresholds = pgTable(
  'milestone_thresholds',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    type: text().notNull(),
    threshold: integer().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  table => [
    unique('milestone_thresholds_type_threshold_key').on(
      table.type,
      table.threshold
    ),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
    check(
      'milestone_thresholds_type_check',
      sql`type = ANY (ARRAY['post_view'::text, 'post_like'::text, 'comment_like'::text, 'subscriber'::text])`
    ),
  ]
);

export const notifications = pgTable(
  'notifications',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    type: text().notNull(),
    isRead: boolean('is_read').default(false).notNull(),
    postId: uuid('post_id'),
    commentId: uuid('comment_id'),
    commentCount: integer('comment_count'),
    representativeUserId: uuid('representative_user_id'),
    representativeCommentId: uuid('representative_comment_id'),
    milestoneValue: integer('milestone_value'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    inquiryThreadId: uuid('inquiry_thread_id'),
  },
  table => [
    uniqueIndex('idx_notifications_comment_milestone_unique')
      .using(
        'btree',
        table.commentId.asc().nullsLast(),
        table.type.asc().nullsLast(),
        table.milestoneValue.asc().nullsLast()
      )
      .where(sql`(type = 'comment_like_milestone'::text)`),
    uniqueIndex('idx_notifications_comment_upsert')
      .using(
        'btree',
        table.postId.asc().nullsLast(),
        table.type.asc().nullsLast()
      )
      .where(sql`((type = 'comment'::text) AND (is_read = false))`),
    uniqueIndex('idx_notifications_inquiry_reply_upsert')
      .using(
        'btree',
        table.inquiryThreadId.asc().nullsLast(),
        table.type.asc().nullsLast()
      )
      .where(sql`((type = 'inquiry_reply'::text) AND (is_read = false))`),
    uniqueIndex('idx_notifications_post_milestone_unique')
      .using(
        'btree',
        table.postId.asc().nullsLast(),
        table.type.asc().nullsLast(),
        table.milestoneValue.asc().nullsLast()
      )
      .where(
        sql`(type = ANY (ARRAY['post_view_milestone'::text, 'post_like_milestone'::text]))`
      ),
    uniqueIndex('idx_notifications_subscriber_milestone_unique')
      .using(
        'btree',
        table.userId.asc().nullsLast(),
        table.type.asc().nullsLast(),
        table.milestoneValue.asc().nullsLast()
      )
      .where(sql`(type = 'subscriber_milestone'::text)`),
    index('idx_notifications_user_unread')
      .using('btree', table.userId.asc().nullsLast())
      .where(sql`(is_read = false)`),
    index('idx_notifications_user_updated').using(
      'btree',
      table.userId.asc().nullsLast(),
      table.updatedAt.desc().nullsFirst(),
      table.id.desc().nullsFirst()
    ),
    foreignKey({
      columns: [table.commentId],
      foreignColumns: [comments.id],
      name: 'notifications_comment_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.inquiryThreadId],
      foreignColumns: [inquiryThreads.id],
      name: 'notifications_inquiry_thread_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
      name: 'notifications_post_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.representativeCommentId],
      foreignColumns: [comments.id],
      name: 'notifications_representative_comment_id_fkey',
    }).onDelete('set null'),
    foreignKey({
      columns: [table.representativeUserId],
      foreignColumns: [users.id],
      name: 'notifications_representative_user_id_fkey',
    }).onDelete('set null'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'notifications_user_id_fkey',
    }).onDelete('cascade'),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
    check(
      'chk_comment_fields',
      sql`(type <> 'comment'::text) OR ((post_id IS NOT NULL) AND (comment_count IS NOT NULL))`
    ),
    check(
      'chk_comment_like_fields',
      sql`(type <> 'comment_like_milestone'::text) OR ((comment_id IS NOT NULL) AND (milestone_value IS NOT NULL))`
    ),
    check(
      'chk_inquiry_reply_fields',
      sql`(type <> 'inquiry_reply'::text) OR (inquiry_thread_id IS NOT NULL)`
    ),
    check(
      'chk_post_milestone_fields',
      sql`(type <> ALL (ARRAY['post_view_milestone'::text, 'post_like_milestone'::text])) OR ((post_id IS NOT NULL) AND (milestone_value IS NOT NULL))`
    ),
    check(
      'chk_subscriber_fields',
      sql`(type <> 'subscriber_milestone'::text) OR (milestone_value IS NOT NULL)`
    ),
    check(
      'notifications_type_check',
      sql`type = ANY (ARRAY['comment'::text, 'post_view_milestone'::text, 'post_like_milestone'::text, 'comment_like_milestone'::text, 'subscriber_milestone'::text, 'inquiry_reply'::text])`
    ),
  ]
);

export const outreachEmails = pgTable(
  'outreach_emails',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    creatorId: uuid('creator_id').notNull(),
    gmailThreadId: text('gmail_thread_id'),
    gmailMessageId: text('gmail_message_id'),
    direction: text().notNull(),
    subject: text().notNull(),
    body: text().notNull(),
    sentAt: timestamp('sent_at', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    messageId: text('message_id'),
    isRead: boolean('is_read').default(false).notNull(),
  },
  table => [
    foreignKey({
      columns: [table.creatorId],
      foreignColumns: [creators.id],
      name: 'outreach_emails_creator_id_fkey',
    }).onDelete('cascade'),
    unique('outreach_emails_gmail_message_id_unique').on(table.gmailMessageId),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
  ]
);

export const posts = pgTable(
  'posts',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    tags: text().array().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    title: text().notNull(),
    passwordHash: text('password_hash'),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    userId: uuid('user_id').notNull(),
    seriesId: uuid('series_id'),
    seriesOrder: integer('series_order'),
    visibility: text().default('public').notNull(),
    contentJson: jsonb('content_json').notNull(),
    preview: text().notNull(),
    contentText: text('content_text').notNull(),
  },
  table => [
    index('idx_posts_created_at').using(
      'btree',
      table.createdAt.desc().nullsFirst()
    ),
    index('idx_posts_series_id').using(
      'btree',
      table.seriesId.asc().nullsLast()
    ),
    index('idx_posts_series_order').using(
      'btree',
      table.seriesId.asc().nullsLast(),
      table.seriesOrder.asc().nullsLast()
    ),
    index('idx_posts_tags').using(
      'gin',
      table.tags.asc().nullsLast().op('array_ops')
    ),
    index('idx_posts_tags_trgm').using(
      'gin',
      sql`immutable_array_to_string(tags, ' '::text)`
    ),
    index('idx_posts_title_trgm').using(
      'gin',
      table.title.asc().nullsLast().op('gin_trgm_ops')
    ),
    index('idx_posts_user_id').using(
      'btree',
      table.userId.asc().nullsLast()
    ),
    index('idx_posts_visibility').using(
      'btree',
      table.visibility.asc().nullsLast()
    ),
    foreignKey({
      columns: [table.seriesId],
      foreignColumns: [series.id],
      name: 'posts_series_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('set null'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'posts_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
    check('posts_title_check', sql`char_length(title) <= 100`),
    check(
      'posts_visibility_check',
      sql`visibility = ANY (ARRAY['public'::text, 'unlisted'::text, 'private'::text])`
    ),
  ]
);

export const postStats = pgTable(
  'post_stats',
  {
    postId: uuid('post_id').primaryKey().notNull(),
    likeCount: integer('like_count').default(0).notNull(),
    viewCount: integer('view_count').default(0).notNull(),
    commentCount: integer('comment_count').default(0).notNull(),
    avgReadTime: numeric('avg_read_time').default('0').notNull(),
    popularity: numeric().default('0').notNull(),
  },
  table => [
    index('idx_post_stats_popularity').using(
      'btree',
      table.popularity.desc().nullsFirst()
    ),
    foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
      name: 'post_stats_post_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    unique('post_stats_post_id_unique').on(table.postId),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
  ]
);

export const postViews = pgTable(
  'post_views',
  {
    userId: uuid('user_id').notNull(),
    postId: uuid('post_id').notNull(),
    readDuration: integer('read_duration').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    id: uuid().defaultRandom().primaryKey().notNull(),
  },
  table => [
    index('idx_post_views_post_id').using(
      'btree',
      table.postId.asc().nullsLast()
    ),
    index('idx_post_views_user_id').using(
      'btree',
      table.userId.asc().nullsLast(),
      table.createdAt.desc().nullsFirst()
    ),
    foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
      name: 'post_views_post_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'post_views_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
  ]
);

export const gmailTokens = pgTable(
  'gmail_tokens',
  {
    id: text().default('default').primaryKey().notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  table => [
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
  ]
);

export const drafts = pgTable(
  'drafts',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    postId: uuid('post_id'),
    title: text().default('').notNull(),
    contentJson: jsonb('content_json'),
    tags: text().array().default(['']).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  table => [
    index('idx_post_drafts_user_id').using(
      'btree',
      table.userId.asc().nullsLast()
    ),
    foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
      name: 'post_drafts_post_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'post_drafts_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
  ]
);

export const media = pgTable(
  'media',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    userId: uuid('user_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    url: text(),
    type: text().default('image').notNull(),
  },
  table => [
    index('idx_media_user_id').using(
      'btree',
      table.userId.asc().nullsLast()
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'media_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
  ]
);

export const creators = pgTable(
  'creators',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    channelName: text('channel_name').notNull(),
    email: text().notNull(),
    memo: text(),
    status: text().default('pending').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    lastMailedAt: timestamp('last_mailed_at', {
      withTimezone: true,
      mode: 'string',
    }),
    userId: uuid('user_id'),
  },
  table => [
    index('creators_user_id_idx')
      .using('btree', table.userId.asc().nullsLast())
      .where(sql`(user_id IS NOT NULL)`),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'creators_user_id_fkey',
    }),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
  ]
);

export const inquiryMessages = pgTable(
  'inquiry_messages',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    threadId: uuid('thread_id').notNull(),
    senderType: text('sender_type').notNull(),
    senderId: uuid('sender_id').notNull(),
    content: text().notNull(),
    images: uuid().array().default(['']),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  table => [
    index('idx_inquiry_messages_thread').using(
      'btree',
      table.threadId.asc().nullsLast(),
      table.createdAt.asc().nullsLast()
    ),
    foreignKey({
      columns: [table.senderId],
      foreignColumns: [users.id],
      name: 'inquiry_messages_sender_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.threadId],
      foreignColumns: [inquiryThreads.id],
      name: 'inquiry_messages_thread_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
    check(
      'inquiry_messages_sender_type_check',
      sql`sender_type = ANY (ARRAY['USER'::text, 'ADMIN'::text])`
    ),
  ]
);

export const inquiryThreads = pgTable(
  'inquiry_threads',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    status: text().default('AWAITING_REPLY').notNull(),
    statusChangedAt: timestamp('status_changed_at', {
      withTimezone: true,
      mode: 'string',
    })
      .defaultNow()
      .notNull(),
    lastMessagePreview: text('last_message_preview'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
    lastMessageId: uuid('last_message_id'),
    firstMessagePreview: text('first_message_preview'),
    firstMessageId: uuid('first_message_id'),
    userUnreadCount: integer('user_unread_count').default(0).notNull(),
    adminUnreadCount: integer('admin_unread_count').default(0).notNull(),
  },
  table => [
    index('idx_inquiry_threads_auto_close')
      .using(
        'btree',
        table.statusChangedAt.asc().nullsLast()
      )
      .where(sql`((status = 'ANSWERED'::text) AND (is_deleted = false))`),
    index('idx_inquiry_threads_user').using(
      'btree',
      table.userId.asc().nullsLast(),
      table.updatedAt.desc().nullsFirst()
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'inquiry_threads_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
    check(
      'inquiry_threads_status_check',
      sql`status = ANY (ARRAY['AWAITING_REPLY'::text, 'ANSWERED'::text, 'CLOSED'::text])`
    ),
  ]
);

export const postsV2 = pgTable(
  'posts_v2',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    tags: text().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    title: text().notNull(),
    passwordHash: text('password_hash'),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    userId: uuid('user_id').notNull(),
    seriesId: uuid('series_id'),
    seriesOrder: integer('series_order'),
    visibility: text().default('public').notNull(),
    contentJson: jsonb('content_json').notNull(),
    preview: text().notNull(),
    contentText: text('content_text').notNull(),
  },
  table => [
    index('posts_v2_author_id_idx').using(
      'btree',
      table.userId.asc().nullsLast()
    ),
    index('posts_v2_created_at_idx').using(
      'btree',
      table.createdAt.desc().nullsFirst()
    ),
    index('posts_v2_immutable_array_to_string_idx').using(
      'gin',
      sql`immutable_array_to_string(tags, ' '::text)`
    ),
    index('posts_v2_series_id_idx').using(
      'btree',
      table.seriesId.asc().nullsLast()
    ),
    index('posts_v2_series_id_series_order_idx').using(
      'btree',
      table.seriesId.asc().nullsLast(),
      table.seriesOrder.asc().nullsLast()
    ),
    index('posts_v2_tags_idx').using(
      'gin',
      table.tags.asc().nullsLast().op('array_ops')
    ),
    index('posts_v2_title_idx').using(
      'gin',
      table.title.asc().nullsLast().op('gin_trgm_ops')
    ),
    index('posts_v2_visibility_idx').using(
      'btree',
      table.visibility.asc().nullsLast()
    ),
    foreignKey({
      columns: [table.seriesId],
      foreignColumns: [series.id],
      name: 'posts_v2_series_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('set null'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'posts_v2_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
    check('posts_title_check', sql`char_length(title) <= 100`),
    check(
      'posts_visibility_check',
      sql`visibility = ANY (ARRAY['public'::text, 'unlisted'::text, 'private'::text])`
    ),
  ]
);

export const mediaVariants = pgTable(
  'media_variants',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    mediaId: uuid('media_id').notNull(),
    variant: text(),
    url: text().notNull(),
    description: text(),
    width: integer(),
    height: integer(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    type: text().default('image').notNull(),
  },
  table => [
    index('idx_media_variants_media_id').using(
      'btree',
      table.mediaId.asc().nullsLast()
    ),
    uniqueIndex('media_variants_audio_unique')
      .using('btree', table.mediaId.asc().nullsLast())
      .where(sql`(type = 'audio'::text)`),
    uniqueIndex('media_variants_image_unique')
      .using(
        'btree',
        table.mediaId.asc().nullsLast(),
        table.variant.asc().nullsLast()
      )
      .where(sql`(type = 'image'::text)`),
    foreignKey({
      columns: [table.mediaId],
      foreignColumns: [mediaV2.id],
      name: 'media_variants_media_id_fkey',
    }).onDelete('cascade'),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
    check(
      'media_variants_type_check',
      sql`type = ANY (ARRAY['image'::text, 'audio'::text])`
    ),
    check(
      'media_variants_variant_check',
      sql`((type = 'image'::text) AND (variant = ANY (ARRAY['small'::text, 'medium'::text, 'original'::text]))) OR ((type = 'audio'::text) AND (variant IS NULL))`
    ),
  ]
);

export const mediaV2 = pgTable(
  'media_v2',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    sizeBytes: integer('size_bytes').notNull(),
  },
  table => [
    index('media_v2_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast()
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'media_v2_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
  ]
);

export const usersV2 = pgTable(
  'users_v2',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    nickname: text(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
    registeredAt: timestamp('registered_at', {
      withTimezone: true,
      mode: 'string',
    }),
    bio: text(),
    subscriberCount: integer('subscriber_count').default(0).notNull(),
    profileImageId: uuid('profile_image_id'),
  },
  table => [
    uniqueIndex('users_v2_nickname_idx')
      .using('btree', table.nickname.asc().nullsLast())
      .where(sql`(deleted_at IS NULL)`),
    foreignKey({
      columns: [table.profileImageId],
      foreignColumns: [mediaV2.id],
      name: 'users_v2_profile_image_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('set null'),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
    check(
      'users_bio_length_check',
      sql`(bio IS NULL) OR (char_length(bio) <= 200)`
    ),
    check(
      'users_nickname_length_check',
      sql`(char_length(nickname) >= 1) AND (char_length(nickname) <= 50)`
    ),
  ]
);

export const sessions = pgTable(
  'sessions',
  {
    sessionToken: text('session_token').primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    expires: timestamp({ withTimezone: true }).notNull(),
  },
  table => [
    index('sessions_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast()
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'sessions_user_id_fkey',
    }).onDelete('cascade'),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
  ]
);

export const subscriptions = pgTable(
  'subscriptions',
  {
    followerId: uuid('follower_id').notNull(),
    followingId: uuid('following_id').notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  table => [
    index('idx_subscriptions_following').using(
      'btree',
      table.followingId.asc().nullsLast()
    ),
    foreignKey({
      columns: [table.followerId],
      foreignColumns: [users.id],
      name: 'subscriptions_follower_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.followingId],
      foreignColumns: [users.id],
      name: 'subscriptions_following_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    primaryKey({
      columns: [table.followerId, table.followingId],
      name: 'subscriptions_pkey',
    }),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
    check('subscriptions_no_self_follow', sql`follower_id <> following_id`),
  ]
);

export const postLikes = pgTable(
  'post_likes',
  {
    userId: uuid('user_id').notNull(),
    postId: uuid('post_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  table => [
    foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
      name: 'post_likes_post_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'post_likes_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    primaryKey({
      columns: [table.userId, table.postId],
      name: 'post_likes_pkey',
    }),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
  ]
);

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text().notNull(),
    token: text().notNull(),
    expires: timestamp({ withTimezone: true }).notNull(),
  },
  table => [
    primaryKey({
      columns: [table.identifier, table.token],
      name: 'verification_tokens_pkey',
    }),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
  ]
);

export const postSkips = pgTable(
  'post_skips',
  {
    userId: uuid('user_id').notNull(),
    postId: uuid('post_id').notNull(),
    skipCount: integer('skip_count').default(1).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  table => [
    foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
      name: 'post_skips_post_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'post_skips_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    primaryKey({
      columns: [table.userId, table.postId],
      name: 'post_skips_pkey',
    }),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
  ]
);

export const accounts = pgTable(
  'accounts',
  {
    userId: uuid('user_id').notNull(),
    type: text().notNull(),
    provider: text().notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text(),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  table => [
    index('accounts_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast()
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'accounts_user_id_fkey',
    }).onDelete('cascade'),
    primaryKey({
      columns: [table.provider, table.providerAccountId],
      name: 'accounts_pkey',
    }),
    pgPolicy('Block all access', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`false`,
    }),
  ]
);
