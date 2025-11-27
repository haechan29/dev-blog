import { getCommentsFromDB } from '@/features/comment/data/queries/commentQueries';
import { PostNotFoundError } from '@/features/post/data/errors/postErrors';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const data = getCommentsFromDB(postId);
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
    const { authorName, content, password } = await request.json();

    if (!postId || !content || !password) {
      return NextResponse.json(
        { error: '댓글 생성 요청에 필요한 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_name: authorName,
        content,
        password_hash: passwordHash,
      })
      .select(
        'id, post_id, author_name, content, created_at, updated_at, like_count'
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data[0] });
  } catch {
    return NextResponse.json(
      { error: '댓글 생성 요청이 실패했습니다.' },
      { status: 500 }
    );
  }
}
