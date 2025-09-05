import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;

    const { data, error } = await supabase
      .from('post_stats')
      .select('*')
      .eq('post_id', postId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: `post_stat이 존재하지 않습니다. postId: ${postId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: '댓글 게시글 통계 조회 요청이 실패했습니다.' },
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

    if (!postId) {
      return NextResponse.json(
        { error: '게시글 통계를 생성하기 위해 postId가 필요합니다.' },
        { status: 400 }
      );
    }

    const isExisting = await isPostStatExisting(postId);

    if (isExisting) {
      return NextResponse.json(
        { error: '이미 존재하는 게시글 통계입니다.' },
        { status: 409 }
      );
    }

    const { error } = await supabase
      .from('post_stats')
      .insert({
        post_id: postId,
        like_count: 0,
        comment_count: 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: null }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: '통계 생성 요청이 실패했습니다.' },
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

    const isExisting = await isPostStatExisting(postId);

    if (!isExisting) {
      return NextResponse.json(
        { error: `삭제할 게시글 통계가 존재하지 않습니다. postId: ${postId}` },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from('post_stats')
      .delete()
      .eq('post_id', postId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: null });
  } catch (error) {
    return NextResponse.json(
      { error: '게시글 통계 삭제 요청이 실패했습니다.' },
      { status: 500 }
    );
  }
}

async function isPostStatExisting(postId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('post_stats')
    .select('post_id')
    .eq('post_id', postId)
    .maybeSingle();
  return Boolean(data && !error);
}
