import { ApiError, NotFoundError, UnauthorizedError } from '@/errors/errors';
import * as DraftQueries from '@/features/draft/data/queries/draftQueries';
import { getUserId } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const { draftId } = await params;
    if (!draftId) {
      throw new NotFoundError('임시저장을 찾을 수 없습니다');
    }

    const ownership = await DraftQueries.fetchDraftOwnership(draftId);
    if (!ownership) {
      throw new NotFoundError('임시저장을 찾을 수 없습니다');
    }
    if (ownership.userId !== userId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const { postId, title, contentJson, tags } = await request.json();

    const data = await DraftQueries.updateDraft({
      draftId,
      postId,
      title,
      contentJson,
      tags,
    });
    return NextResponse.json({ data });
  } catch (error) {
    console.error('임시저장 수정 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '임시저장 수정 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
) {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    const { draftId } = await params;
    if (!draftId) {
      throw new NotFoundError('임시저장을 찾을 수 없습니다');
    }

    const ownership = await DraftQueries.fetchDraftOwnership(draftId);
    if (!ownership) {
      throw new NotFoundError('임시저장을 찾을 수 없습니다');
    }
    if (ownership.userId !== userId) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    await DraftQueries.deleteDraft(draftId);

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('임시저장 삭제 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '임시저장 삭제 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}
