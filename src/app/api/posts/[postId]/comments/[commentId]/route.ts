import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: number }> }
) {
  try {
    const { commentId } = await params;
    const { content, password } = await request.json();

    if (!commentId || !content || !password) {
      return NextResponse.json(
        { error: '댓글 수정 요청에 필요한 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const { isCommentExist, isValidPassword } = await checkPassword(
      commentId,
      password
    );
    if (!isCommentExist) {
      return NextResponse.json(
        { error: `댓글을 찾을 수 없습니다. (id: ${commentId})` },
        { status: 404 }
      );
    } else if (!isValidPassword) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('comments')
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', commentId)
      .select('id, post_id, author_name, content, created_at, updated_at');

    if (error) {
      return NextResponse.json(
        { error: '댓글 수정에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data[0] });
  } catch {
    return NextResponse.json(
      { error: '댓글 수정 요청이 실패했습니다.' },
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

    if (!commentId || !password) {
      return NextResponse.json(
        { error: '댓글 삭제 요청에 필요한 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const { isCommentExist, isValidPassword } = await checkPassword(
      commentId,
      password
    );
    if (!isCommentExist) {
      return NextResponse.json(
        { error: `댓글을 찾을 수 없습니다. (id: ${commentId})` },
        { status: 404 }
      );
    } else if (!isValidPassword) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      return NextResponse.json(
        { error: '댓글 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: null });
  } catch {
    return NextResponse.json(
      { error: '댓글 삭제 요청이 실패했습니다.' },
      { status: 500 }
    );
  }
}

async function checkPassword(commentId: number, password: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('id, password_hash')
    .eq('id', commentId)
    .maybeSingle();

  if (error || !data) {
    return { isCommentExist: false, isValidPassword: false };
  }

  const isValidPassword = await bcrypt.compare(password, data.password_hash);
  if (!isValidPassword) {
    return { isCommentExist: true, isValidPassword: false };
  }

  return { isCommentExist: true, isValidPassword: true };
}
