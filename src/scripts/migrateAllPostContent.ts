import { migratePostContentToJson } from '@/migration/migratePostContentJson';
import { fetchPostsNeedingContentJsonMigration } from '@/migration/postQueries';

async function main() {
  try {
    const posts = await fetchPostsNeedingContentJsonMigration();

    if (posts.length === 0) {
      console.log('마이그레이션이 필요한 게시물이 없습니다.');
      return;
    }

    console.log(`총 ${posts.length}개 게시물 마이그레이션 시작`);

    for (const post of posts) {
      const postId = post.id as string;

      try {
        await migratePostContentToJson(postId);
        console.log(`게시물(${postId}) 마이그레이션 완료`);
      } catch (error) {
        console.error(`게시물(${postId}) 마이그레이션 실패`);
        console.error(error);
      }
    }

    console.log('전체 게시물 마이그레이션 완료');
  } catch (error) {
    console.error('마이그레이션 준비 중 오류 발생');
    console.error(error);
    process.exit(1);
  }
}

main();

