import { auth } from '@/auth';
import { ApiError, UnauthorizedError, ValidationError } from '@/errors/errors';
import * as CommentQueries from '@/features/comment/data/queries/commentQueries';
import { getUserId } from '@/lib/user';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: number }> }
) {
  try {
    const { commentId } = await params;
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

    const comment = await CommentQueries.fetchComment(commentId);

    if (userId !== comment.user_id) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    if (!session) {
      const isValid =
        comment.password_hash &&
        (await bcrypt.compare(password, comment.password_hash));

      if (!isValid) {
        throw new UnauthorizedError('비밀번호가 일치하지 않습니다');
      }
    }

    const updated = await CommentQueries.updateComment(commentId, content);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('댓글 수정 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '댓글 수정 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: number }> }
) {
  try {
    const { commentId } = await params;
    const password = request.headers.get('X-Comment-Password');
    const session = await auth();
    const userId = await getUserId();

    if (!userId) {
      throw new ValidationError('사용자 아이디를 찾을 수 없습니다');
    }

    if (!session && !password) {
      throw new ValidationError('비밀번호를 찾을 수 없습니다');
    }

    const comment = await CommentQueries.fetchComment(commentId);

    if (userId !== comment.user_id) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    if (!session) {
      const isValid =
        password &&
        comment.password_hash &&
        (await bcrypt.compare(password, comment.password_hash));

      if (!isValid) {
        throw new UnauthorizedError('비밀번호가 일치하지 않습니다');
      }
    }

    await CommentQueries.deleteComment(commentId);

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('댓글 삭제 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '댓글 삭제 요청이 실패했습니다.' },
      { status: 500 }
    );
  }
}
