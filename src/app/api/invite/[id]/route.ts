import { ApiError, NotFoundError } from '@/errors/errors';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: creator, error } = await supabase
      .from('creators')
      .select('user_id, users(nickname)')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!creator) {
      throw new NotFoundError('크리에이터를 찾을 수 없습니다');
    }

    if (!creator.user_id) {
      throw new NotFoundError('연결된 유저를 찾을 수 없습니다');
    }

    const userId = creator.user_id;

    const cookieStore = await cookies();
    cookieStore.set('userId', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    });

    return NextResponse.redirect(new URL(`/@${userId}/posts`, request.url));
  } catch (error) {
    console.error('유저를 초대하는 데에 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '유저를 초대하는 데에 실패했습니다' },
      { status: 500 }
    );
  }
}
