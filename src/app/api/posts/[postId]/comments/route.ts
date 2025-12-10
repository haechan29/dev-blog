import { auth } from '@/auth';
import * as CommentQueries from '@/features/comment/data/queries/commentQueries';
import { PostNotFoundError } from '@/features/post/data/errors/postErrors';
import { ValidationError } from '@/features/user/data/errors/userErrors';
import { ApiError } from '@/lib/api';
import { getUserId } from '@/lib/user';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const data = await CommentQueries.fetchComments(postId);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('게시글 조회 실패:', error);

    if (error instanceof PostNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: '댓글 조회 요청이 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const { content, password } = await request.json();

    const session = await auth();
    const userId = await getUserId();

    if (!content) {
      throw new ValidationError('내용을 찾을 수 없습니다');
    }

    if (!userId) {
      throw new ValidationError('사용자 아이디를 찾을 수 없습니다');
    }

    if (!session && !password) {
      throw new ValidationError('비밀번호를 찾을 수 없습니다');
    }

    const passwordHash = session ? null : await bcrypt.hash(password, 10);

    const data = await CommentQueries.createComments(
      postId,
      content,
      passwordHash,
      userId
    );

    return NextResponse.json({ data });
  } catch (error) {
    console.error('댓글 생성 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '댓글 생성 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}
