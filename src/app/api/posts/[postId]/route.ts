import { auth } from '@/auth';
import * as ImageQueries from '@/features/image/data/queries/imageQueries';
import { PostNotFoundError } from '@/features/post/data/errors/postErrors';
import * as PostQueries from '@/features/post/data/queries/postQueries';
import { extractImageUrls } from '@/features/post/domain/lib/url';
import {
  UnauthorizedError,
  ValidationError,
} from '@/features/user/data/errors/userErrors';
import { ApiError } from '@/lib/api';
import { r2Client } from '@/lib/r2';
import { getUserId } from '@/lib/user';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const data = await PostQueries.fetchPost(postId);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('게시글 조회에 실패했습니다', error);

    if (error instanceof PostNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: '게시글 조회에 실패했습니다' },
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
    const { title, content, tags, password, seriesId, seriesOrder } =
      await request.json();

    const session = await auth();
    const userId = await getUserId();

    if (!userId) {
      throw new ValidationError('사용자 아이디를 찾을 수 없습니다');
    }

    if (!session && !password) {
      throw new ValidationError('비밀번호를 찾을 수 없습니다');
    }

    const post = await PostQueries.fetchPostForAuth(postId);

    if (userId !== post.user_id) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    if (!session) {
      const isValid =
        post.password_hash &&
        (await bcrypt.compare(password, post.password_hash));

      if (!isValid) {
        throw new UnauthorizedError('비밀번호가 일치하지 않습니다');
      }
    }

    await ImageQueries.unlinkImagesFromPost(postId);

    const imageUrls = extractImageUrls(content);
    await ImageQueries.linkImagesToPost(postId, imageUrls);

    const updated = await PostQueries.updatePost({
      postId,
      title,
      content,
      tags,
      seriesId,
      seriesOrder,
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('게시글 수정 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '게시글 수정 요청이 실패했습니다' },
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

    const session = await auth();
    const userId = await getUserId();

    if (!userId) {
      throw new ValidationError('사용자 아이디를 찾을 수 없습니다');
    }

    if (!session && !password) {
      throw new ValidationError('비밀번호를 찾을 수 없습니다');
    }

    const post = await PostQueries.fetchPostForAuth(postId);

    if (userId !== post.user_id) {
      throw new UnauthorizedError('인증되지 않은 요청입니다');
    }

    if (!session) {
      const isValid =
        password &&
        post.password_hash &&
        (await bcrypt.compare(password, post.password_hash));

      if (!isValid) {
        throw new UnauthorizedError('비밀번호가 일치하지 않습니다');
      }
    }

    const images = await ImageQueries.getImagesByPostId(postId);

    await Promise.all(
      images.map(async image => {
        const key = image.url.split('/').pop();
        if (key) {
          await r2Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME,
              Key: key,
            })
          );
        }
      })
    );

    await PostQueries.deletePost(postId);

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('게시글 삭제 요청이 실패했습니다', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: '게시글 삭제 요청이 실패했습니다' },
      { status: 500 }
    );
  }
}
