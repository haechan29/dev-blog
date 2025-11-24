import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: '게시글 목록 조회 요청이 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, password, tags } = await request.json();
    if (!title || !content || !password) {
      return NextResponse.json(
        { error: '게시글 생성 요청에 필요한 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const { data: post, error: postError } = await createPost({
      title,
      tags,
      passwordHash,
      content,
    });

    if (postError) {
      return NextResponse.json({ error: postError.message }, { status: 500 });
    }

    const { error: statError } = await createPostStat(post.id);
    if (statError) {
      await deletePost(post.id);
      return NextResponse.json({ error: statError.message }, { status: 500 });
    }

    return NextResponse.json({ data: post });
  } catch {
    return NextResponse.json(
      { error: '게시글 생성 요청이 실패했습니다.' },
      { status: 500 }
    );
  }
}

async function createPost({
  title,
  tags,
  passwordHash,
  content,
}: {
  title: string;
  tags: string[];
  passwordHash: string;
  content: string;
}) {
  return await supabase
    .from('posts')
    .insert({
      title,
      content,
      password_hash: passwordHash,
      tags,
    })
    .select('id, title, content, tags, created_at, updated_at')
    .single();
}

async function deletePost(postId: string) {
  await supabase.from('posts').delete().eq('id', postId);
}

async function createPostStat(postId: string) {
  return await supabase.from('post_stats').insert({
    post_id: postId,
    like_count: 0,
    view_count: 0,
  });
}
