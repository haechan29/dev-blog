DROP INDEX "accounts_user_id_idx";--> statement-breakpoint
DROP INDEX "idx_comments_post_id";--> statement-breakpoint
DROP INDEX "idx_comments_user_id";--> statement-breakpoint
DROP INDEX "creators_user_id_idx";--> statement-breakpoint
DROP INDEX "idx_post_drafts_user_id";--> statement-breakpoint
DROP INDEX "idx_inquiry_messages_thread";--> statement-breakpoint
DROP INDEX "idx_inquiry_threads_auto_close";--> statement-breakpoint
DROP INDEX "idx_inquiry_threads_user";--> statement-breakpoint
DROP INDEX "idx_media_user_id";--> statement-breakpoint
DROP INDEX "media_v2_user_id_idx";--> statement-breakpoint
DROP INDEX "idx_media_variants_media_id";--> statement-breakpoint
DROP INDEX "media_variants_audio_unique";--> statement-breakpoint
DROP INDEX "media_variants_image_unique";--> statement-breakpoint
DROP INDEX "idx_notifications_comment_milestone_unique";--> statement-breakpoint
DROP INDEX "idx_notifications_comment_upsert";--> statement-breakpoint
DROP INDEX "idx_notifications_inquiry_reply_upsert";--> statement-breakpoint
DROP INDEX "idx_notifications_post_milestone_unique";--> statement-breakpoint
DROP INDEX "idx_notifications_subscriber_milestone_unique";--> statement-breakpoint
DROP INDEX "idx_notifications_user_unread";--> statement-breakpoint
DROP INDEX "idx_notifications_user_updated";--> statement-breakpoint
DROP INDEX "idx_post_stats_popularity";--> statement-breakpoint
DROP INDEX "idx_post_views_post_id";--> statement-breakpoint
DROP INDEX "idx_post_views_user_id";--> statement-breakpoint
DROP INDEX "idx_posts_created_at";--> statement-breakpoint
DROP INDEX "idx_posts_series_id";--> statement-breakpoint
DROP INDEX "idx_posts_series_order";--> statement-breakpoint
DROP INDEX "idx_posts_user_id";--> statement-breakpoint
DROP INDEX "idx_posts_visibility";--> statement-breakpoint
DROP INDEX "posts_v2_author_id_idx";--> statement-breakpoint
DROP INDEX "posts_v2_created_at_idx";--> statement-breakpoint
DROP INDEX "posts_v2_series_id_idx";--> statement-breakpoint
DROP INDEX "posts_v2_series_id_series_order_idx";--> statement-breakpoint
DROP INDEX "posts_v2_visibility_idx";--> statement-breakpoint
DROP INDEX "idx_series_user_id";--> statement-breakpoint
DROP INDEX "sessions_user_id_idx";--> statement-breakpoint
DROP INDEX "idx_subscriptions_following";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
DROP INDEX "users_nickname_unique";--> statement-breakpoint
DROP INDEX "users_v2_nickname_idx";--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_comments_post_id" ON "comments" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "idx_comments_user_id" ON "comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "creators_user_id_idx" ON "creators" USING btree ("user_id") WHERE (user_id IS NOT NULL);--> statement-breakpoint
CREATE INDEX "idx_post_drafts_user_id" ON "drafts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_inquiry_messages_thread" ON "inquiry_messages" USING btree ("thread_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_inquiry_threads_auto_close" ON "inquiry_threads" USING btree ("status_changed_at") WHERE ((status = 'ANSWERED'::text) AND (is_deleted = false));--> statement-breakpoint
CREATE INDEX "idx_inquiry_threads_user" ON "inquiry_threads" USING btree ("user_id","updated_at" DESC NULLS FIRST);--> statement-breakpoint
CREATE INDEX "idx_media_user_id" ON "media" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "media_v2_user_id_idx" ON "media_v2" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_media_variants_media_id" ON "media_variants" USING btree ("media_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_variants_audio_unique" ON "media_variants" USING btree ("media_id") WHERE (type = 'audio'::text);--> statement-breakpoint
CREATE UNIQUE INDEX "media_variants_image_unique" ON "media_variants" USING btree ("media_id","variant") WHERE (type = 'image'::text);--> statement-breakpoint
CREATE UNIQUE INDEX "idx_notifications_comment_milestone_unique" ON "notifications" USING btree ("comment_id","type","milestone_value") WHERE (type = 'comment_like_milestone'::text);--> statement-breakpoint
CREATE UNIQUE INDEX "idx_notifications_comment_upsert" ON "notifications" USING btree ("post_id","type") WHERE ((type = 'comment'::text) AND (is_read = false));--> statement-breakpoint
CREATE UNIQUE INDEX "idx_notifications_inquiry_reply_upsert" ON "notifications" USING btree ("inquiry_thread_id","type") WHERE ((type = 'inquiry_reply'::text) AND (is_read = false));--> statement-breakpoint
CREATE UNIQUE INDEX "idx_notifications_post_milestone_unique" ON "notifications" USING btree ("post_id","type","milestone_value") WHERE (type = ANY (ARRAY['post_view_milestone'::text, 'post_like_milestone'::text]));--> statement-breakpoint
CREATE UNIQUE INDEX "idx_notifications_subscriber_milestone_unique" ON "notifications" USING btree ("user_id","type","milestone_value") WHERE (type = 'subscriber_milestone'::text);--> statement-breakpoint
CREATE INDEX "idx_notifications_user_unread" ON "notifications" USING btree ("user_id") WHERE (is_read = false);--> statement-breakpoint
CREATE INDEX "idx_notifications_user_updated" ON "notifications" USING btree ("user_id","updated_at" DESC NULLS FIRST,"id" DESC NULLS FIRST);--> statement-breakpoint
CREATE INDEX "idx_post_stats_popularity" ON "post_stats" USING btree ("popularity" DESC NULLS FIRST);--> statement-breakpoint
CREATE INDEX "idx_post_views_post_id" ON "post_views" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "idx_post_views_user_id" ON "post_views" USING btree ("user_id","created_at" DESC NULLS FIRST);--> statement-breakpoint
CREATE INDEX "idx_posts_created_at" ON "posts" USING btree ("created_at" DESC NULLS FIRST);--> statement-breakpoint
CREATE INDEX "idx_posts_series_id" ON "posts" USING btree ("series_id");--> statement-breakpoint
CREATE INDEX "idx_posts_series_order" ON "posts" USING btree ("series_id","series_order");--> statement-breakpoint
CREATE INDEX "idx_posts_user_id" ON "posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_posts_visibility" ON "posts" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX "posts_v2_author_id_idx" ON "posts_v2" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "posts_v2_created_at_idx" ON "posts_v2" USING btree ("created_at" DESC NULLS FIRST);--> statement-breakpoint
CREATE INDEX "posts_v2_series_id_idx" ON "posts_v2" USING btree ("series_id");--> statement-breakpoint
CREATE INDEX "posts_v2_series_id_series_order_idx" ON "posts_v2" USING btree ("series_id","series_order");--> statement-breakpoint
CREATE INDEX "posts_v2_visibility_idx" ON "posts_v2" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX "idx_series_user_id" ON "series" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_subscriptions_following" ON "subscriptions" USING btree ("following_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email") WHERE (email IS NOT NULL);--> statement-breakpoint
CREATE UNIQUE INDEX "users_nickname_unique" ON "users" USING btree ("nickname") WHERE (deleted_at IS NULL);--> statement-breakpoint
CREATE UNIQUE INDEX "users_v2_nickname_idx" ON "users_v2" USING btree ("nickname") WHERE (deleted_at IS NULL);