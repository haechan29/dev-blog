import { auth } from '@/auth';
import {
  createPost,
  deletePost,
  fetchPosts,
} from '@/features/post/data/queries/postQueries';
import { PostStatCreationError } from '@/features/postStat/data/errors/postStatErrors';
import { createPostStat } from '@/features/postStat/data/queries/postStatQueries';
import { ErrorCode } from '@/types/api';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await fetchPosts();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('게시글 목록 조회 실패:', error);
    const message =
      process.env.NODE_ENV === 'development'
        ? (error as Error).message
        : '게시글 목록 조회 요청이 실패했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, password, tags } = await request.json();

    const session = await auth();
    const userId = session?.user?.id ?? null;
    const guestId = request.cookies.get('guestId')?.value ?? null;

    if (!title || !content) {
      return NextResponse.json(
        {
          error: '게시글 생성 요청에 필요한 필드가 누락되었습니다',
          code: ErrorCode.VALIDATION_ERROR,
        },
        { status: 400 }
      );
    }

    if (session) {
      if (!userId) {
        return NextResponse.json(
          {
            error: '유저 아이디가 존재하지 않습니다',
            code: ErrorCode.MISSING_USER_ID,
          },
          { status: 400 }
        );
      }
    } else {
      if (!password) {
        return NextResponse.json(
          {
            error: '비회원 게시글 생성 요청에 비밀번호가 누락되었습니다',
            code: ErrorCode.MISSING_PASSWORD,
          },
          { status: 400 }
        );
      }

      if (!guestId) {
        return NextResponse.json(
          {
            error: '비회원 게시글 생성 요청에 게스트 아이디가 누락되었습니다',
            code: ErrorCode.MISSING_GUEST_ID,
          },
          { status: 400 }
        );
      }
    }

    const passwordHash = session ? null : await bcrypt.hash(password, 10);

    const post = await createPost({
      title,
      content,
      tags,
      passwordHash,
      userId,
      guestId: session ? null : guestId,
    });

    await createPostStat(post.id);

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error('게시글 생성 요청이 실패했습니다', error);

    if (error instanceof PostStatCreationError) {
      try {
        await deletePost(error.postId);
      } catch (error) {
        console.error('게시글 삭제 요청(롤백)이 실패했습니다', error);
      }
    }

    return NextResponse.json(
      { error: '게시글 생성 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}
