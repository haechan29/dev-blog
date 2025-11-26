import { PostNotFoundError } from '@/features/post/data/errors/postNotFoundError';
import { getPostFromDB } from '@/features/post/data/queries/postQueries';
import { Post } from '@/features/post/domain/types/post';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const data = await getPostFromDB(postId);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('게시글 조회 실패:', error);

    if (error instanceof PostNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: '게시글 조회 요청이 실패했습니다.' },
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
    const { title, content, tags, password } = await request.json();

    if (!postId || !password) {
      return NextResponse.json(
        { error: '게시글 수정 요청에 필요한 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const { isPostExist, isValidPassword } = await checkPostPassword(
      postId,
      password
    );

    if (!isPostExist) {
      return NextResponse.json(
        { error: `게시글을 찾을 수 없습니다.` },
        { status: 404 }
      );
    } else if (!isValidPassword) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    const newPost: Partial<Post> = {
      updated_at: new Date().toISOString(),
    };
    if (title !== undefined) newPost.title = title;
    if (content !== undefined) newPost.content = content;
    if (tags !== undefined) newPost.tags = tags;

    const { data, error } = await supabase
      .from('posts')
      .update(newPost)
      .eq('id', postId)
      .select('id, title, content, tags, created_at, updated_at');

    if (error) {
      return NextResponse.json(
        { error: '게시글 수정에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data[0] });
  } catch {
    return NextResponse.json(
      { error: '게시글 수정 요청이 실패했습니다.' },
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

    if (!postId || !password) {
      return NextResponse.json(
        { error: '게시글 삭제 요청에 필요한 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const { isPostExist, isValidPassword } = await checkPostPassword(
      postId,
      password
    );

    if (!isPostExist) {
      return NextResponse.json(
        { error: `게시글을 찾을 수 없습니다.` },
        { status: 404 }
      );
    } else if (!isValidPassword) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    const { error: statError } = await supabase
      .from('post_stats')
      .delete()
      .eq('post_id', postId);

    if (statError) {
      return NextResponse.json(
        { error: '게시글 통계 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    const { error: postError } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (postError) {
      return NextResponse.json(
        { error: '게시글 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: null });
  } catch {
    return NextResponse.json(
      { error: '게시글 삭제 요청이 실패했습니다.' },
      { status: 500 }
    );
  }
}

async function checkPostPassword(postId: string, password: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('id, password_hash')
    .eq('id', postId)
    .maybeSingle();

  if (error || !data) {
    return { isPostExist: false, isValidPassword: false };
  }

  const isValidPassword = await bcrypt.compare(password, data.password_hash);
  if (!isValidPassword) {
    return { isPostExist: true, isValidPassword: false };
  }

  return { isPostExist: true, isValidPassword: true };
}
