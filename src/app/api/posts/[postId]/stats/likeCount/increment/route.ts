import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;

    const { data: currentData, error: fetchError } = await supabase
      .from('post_stats')
      .select('like_count')
      .eq('post_id', postId)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!currentData) {
      return NextResponse.json(
        { error: `게시글 통계가 존재하지 않습니다. postId: ${postId}` },
        { status: 404 }
      );
    }

    const newLikeCount = currentData.like_count + 1;

    const { data, error } = await supabase
      .from('post_stats')
      .update({ like_count: newLikeCount })
      .eq('post_id', postId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: '좋아요 수 증가 요청이 실패했습니다.' },
      { status: 500 }
    );
  }
}
