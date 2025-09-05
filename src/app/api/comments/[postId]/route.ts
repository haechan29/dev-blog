import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;

  if (!postId) {
    return NextResponse.json(
      { error: 'post_id가 없어서 게시글 조회에 실패했습니다.' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('comments')
    .select('id, post_id, author_name, content, created_at, updated_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
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
      .select('id, post_id, author_name, content, created_at, updated_at');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data[0] });
  } catch (error) {
    return NextResponse.json(
      { error: '댓글 생성 요청이 실패했습니다.' },
      { status: 400 }
    );
  }
}

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
  } catch (e) {
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
  } catch (e) {
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
