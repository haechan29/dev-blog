import { auth } from '@/auth';
import { ApiError, UnauthorizedError, ValidationError } from '@/errors/errors';
import * as CreatorQueries from '@/features/creator/data/queries/creatorQueries';
import * as DraftQueries from '@/features/draft/data/queries/draftQueries';
import { toDto } from '@/features/post/data/mapper/postMapper';
import * as PostQueries from '@/features/post/data/queries/postQueries';
import * as PostUsecase from '@/features/post/data/usecases/postUsecase';
import { rendererExtensions } from '@/features/post/domain/lib/extensions';
import { normalizeText } from '@/lib/text';
import { getUserId } from '@/lib/user';
import { generateText } from '@tiptap/core';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const data = await PostUsecase.getPost(postId);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('게시글 조회에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '게시글 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const {
      title,
      contentJson,
      tags,
      password,
      seriesId,
      seriesOrder,
      visibility,
      draftId,
    } = await request.json();

    const session = await auth();
    const userId = await getUserId();

    if (!userId) {
      throw new ValidationError('사용자 아이디를 찾을 수 없습니다');
    }

    const { userId: postUserId, passwordHash } =
      await PostQueries.fetchPostForAuth(postId);

    if (userId !== postUserId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const skipPasswordCheck =
      session || !!(await CreatorQueries.fetchCreatorByUserId(userId));

    if (!skipPasswordCheck && !password) {
      throw new ValidationError('비밀번호를 찾을 수 없습니다');
    }

    if (!skipPasswordCheck) {
      const isValid =
        passwordHash && (await bcrypt.compare(password, passwordHash));

      if (!isValid) {
        throw new UnauthorizedError('비밀번호가 일치하지 않습니다');
      }
    }

    const raw = contentJson
      ? generateText(contentJson, rendererExtensions)
      : undefined;
    const contentText = raw ? normalizeText(raw) : undefined;
    const preview = contentText ? contentText.slice(0, 1000) : undefined;

    const updated = await PostQueries.updatePost({
      postId,
      title,
      contentJson,
      tags,
      seriesId,
      seriesOrder,
      visibility,
      preview,
      contentText,
    });

    const post = toDto(updated);

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
    console.error('게시글 수정 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '게시글 수정 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const password = request.headers.get('X-Post-Password');

    const session = await auth();
    const userId = await getUserId();

    if (!userId) {
      throw new ValidationError('사용자 아이디를 찾을 수 없습니다');
    }

    const post = await PostQueries.fetchPostForAuth(postId);

    if (userId !== post.userId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const skipPasswordCheck =
      session || !!(await CreatorQueries.fetchCreatorByUserId(userId));

    if (!skipPasswordCheck && !password) {
      throw new ValidationError('비밀번호를 찾을 수 없습니다');
    }

    if (!skipPasswordCheck) {
      const isValid =
        password &&
        post.passwordHash &&
        (await bcrypt.compare(password, post.passwordHash));

      if (!isValid) {
        throw new UnauthorizedError('비밀번호가 일치하지 않습니다');
      }
    }

    await PostQueries.deletePost(postId);

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('게시글 삭제 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '게시글 삭제 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}
