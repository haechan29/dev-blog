import { auth } from '@/auth';
import { ApiError, UnauthorizedError, ValidationError } from '@/errors/errors';
import * as CreatorQueries from '@/features/creator/data/queries/creatorQueries';
import * as DraftQueries from '@/features/draft/data/queries/draftQueries';
import * as PostQueries from '@/features/post/data/queries/postQueries';
import * as FeedUsecase from '@/features/post/data/usecases/feedUsecase';
import * as PostUsecase from '@/features/post/data/usecases/postUsecase';
import * as SearchUsecase from '@/features/post/data/usecases/searchUsecase';
import { rendererExtensions } from '@/features/post/domain/lib/extensions';
import { PostStatCreationError } from '@/features/postStat/data/errors/postStatErrors';
import * as PostStatQueries from '@/features/postStat/data/queries/postStatQueries';
import { getUserId } from '@/lib/user';
import { generateText } from '@tiptap/core';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'feed') {
      const userId = await getUserId();
      const cursor = searchParams.get('cursor');
      const excludeId = searchParams.get('excludeId') ?? undefined;
      const data = await FeedUsecase.getFeedPosts(cursor, userId, excludeId);
      return NextResponse.json({ data });
    }

    if (type === 'search') {
      const query = searchParams.get('q');
      const limit = searchParams.get('limit');
      const cursorScore = searchParams.get('cursorScore');
      const cursorId = searchParams.get('cursorId');

      if (!query) {
        throw new ValidationError('검색어를 찾을 수 없습니다');
      }

      if (!limit) {
        throw new ValidationError('검색 갯수를 찾을 수 없습니다');
      }

      const data = await SearchUsecase.searchPosts(
        query,
        parseInt(limit),
        cursorScore ? parseInt(cursorScore) : undefined,
        cursorId ?? undefined
      );

      return NextResponse.json({ data });
    }

    const userId = searchParams.get('userId');

    if (!userId) {
      throw new ValidationError('사용자를 찾을 수 없습니다');
    }

    const data = await PostUsecase.getPostsByUserId(userId);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('게시글 목록 조회에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '게시글 목록 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, contentJson, password, tags, visibility, draftId } =
      await request.json();

    const session = await auth();
    const userId = await getUserId();

    if (!title) {
      throw new ValidationError('제목을 찾을 수 없습니다');
    }
    if (!contentJson) {
      throw new ValidationError('내용을 찾을 수 없습니다');
    }
    if (!userId) {
      throw new ValidationError('사용자 아이디를 찾을 수 없습니다');
    }
    const skipPasswordCheck =
      session || !!(await CreatorQueries.fetchCreatorByUserId(userId));

    if (!skipPasswordCheck && !password) {
      throw new ValidationError('비밀번호를 찾을 수 없습니다');
    }

    const passwordHash = skipPasswordCheck
      ? null
      : await bcrypt.hash(password, 10);

    const contentText = generateText(contentJson, rendererExtensions);
    const preview = contentText.slice(0, 200);

    const post = await PostQueries.createPost({
      title,
      contentJson,
      tags,
      passwordHash,
      visibility,
      userId,
      preview,
      contentText,
    });

    await PostStatQueries.createPostStat(post.id);

    if (draftId) {
      try {
        const ownership = await DraftQueries.fetchDraftOwnership(draftId);

        if (ownership && ownership.userId === userId) {
          await DraftQueries.deleteDraft(draftId);
        }
      } catch (error) {
        console.error('임시저장 삭제에 실패했습니다', error);
      }
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error('게시글 생성 요청이 실패했습니다', error);

    if (error instanceof PostStatCreationError) {
      try {
        await PostQueries.deletePost(error.postId);
      } catch (error) {
        console.error('게시글 삭제 요청(롤백)이 실패했습니다', error);
      }
    }

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '게시글 생성 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const { posts } = await request.json();

    if (!Array.isArray(posts) || posts.length === 0) {
      throw new ValidationError('게시글 목록을 찾을 수 없습니다');
    }

    const postIds = posts.map(p => p.id);
    const existingPosts = await PostQueries.fetchPostsOwnership(postIds);

    if (existingPosts.length !== postIds.length) {
      throw new ValidationError('일부 게시글을 찾을 수 없습니다');
    }

    if (existingPosts.some(post => post.user_id !== userId)) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    await PostQueries.updatePostsInSeries(posts);

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('게시글 순서 변경에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '게시글 순서 변경에 실패했습니다' },
      { status: 500 }
    );
  }
}
