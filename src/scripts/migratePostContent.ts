import { migratePostContentToJson } from '@/migration/migratePostContentJson';

async function main() {
  const postId = process.argv[2];

  if (!postId) {
    process.exit(1);
  }

  try {
    const result = await migratePostContentToJson(postId);

    if (result === null) {
      console.log(`게시물(${postId})은 이미 content_json 이 있습니다. (스킵)`);
    } else {
      console.log(`게시물(${postId}) 마이그레이션 완료`);
      console.dir(result, { depth: null });
    }
  } catch (error) {
    console.error(`게시물(${postId}) 마이그레이션 실패`);
    console.error(error);
    process.exit(1);
  }
}

main();
