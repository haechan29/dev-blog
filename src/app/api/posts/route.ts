import { auth } from '@/auth';
import * as PostQueries from '@/features/post/data/queries/postQueries';
import { PostStatCreationError } from '@/features/postStat/data/errors/postStatErrors';
import * as PostStatQueries from '@/features/postStat/data/queries/postStatQueries';
import {
  UnauthorizedError,
  ValidationError,
} from '@/features/user/data/errors/userErrors';
import { ApiError } from '@/lib/api';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') ?? undefined;

    const data = await PostQueries.fetchPosts(userId);
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
    const { title, content, password, tags } = await request.json();

    const session = await auth();
    const userId = session?.user?.id ?? null;
    const guestId = request.cookies.get('guestId')?.value ?? null;

    if (!title) {
      throw new ValidationError('제목을 찾을 수 없습니다');
    }
    if (!content) {
      throw new ValidationError('내용을 찾을 수 없습니다');
    }
    if (session && !userId) {
      throw new ValidationError('사용자 아이디를 찾을 수 없습니다');
    }
    if (!session && !password) {
      throw new ValidationError('비밀번호를 찾을 수 없습니다');
    }
    if (!session && !guestId) {
      throw new ValidationError('게스트 아이디를 찾을 수 없습니다');
    }

    const passwordHash = session ? null : await bcrypt.hash(password, 10);
    const post = await PostQueries.createPost({
      title,
      content,
      tags,
      passwordHash,
      userId,
      guestId: session ? null : guestId,
    });

    await PostStatQueries.createPostStat(post.id);

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
    const session = await auth();
    const userId = session?.user?.id;

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
