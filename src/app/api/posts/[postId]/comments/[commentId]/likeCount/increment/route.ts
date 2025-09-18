import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> }
) {
  try {
    const { postId, commentId } = await params;

    const { data: currentData, error: fetchError } = await supabase
      .from('comments')
      .select('like_count')
      .eq('post_id', postId)
      .eq('id', commentId)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!currentData) {
      return NextResponse.json(
        { error: `댓글이 존재하지 않습니다. commentId: ${commentId}` },
        { status: 404 }
      );
    }

    const newLikeCount = currentData.like_count + 1;

    const { data, error } = await supabase
      .from('comments')
      .update({ like_count: newLikeCount })
      .eq('post_id', postId)
      .eq('id', commentId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: '댓글 좋아요 수 증가 요청이 실패했습니다.' },
      { status: 500 }
    );
  }
}
