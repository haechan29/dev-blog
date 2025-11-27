import { auth } from '@/auth';
import {
  createPost,
  deletePost,
  fetchPosts,
} from '@/features/post/data/queries/postQueries';
import { PostStatCreationError } from '@/features/postStat/data/errors/postStatErrors';
import { createPostStat } from '@/features/postStat/data/queries/postStatQueries';
import { ValidationError } from '@/features/user/data/errors/userErrors';
import { ApiError } from '@/lib/api';
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

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '게시글 생성 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}
