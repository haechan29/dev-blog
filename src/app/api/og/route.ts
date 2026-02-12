import {
  ApiError,
  ExternalServiceError,
  ValidationError,
} from '@/errors/errors';
import { NextRequest, NextResponse } from 'next/server';
import ogs from 'open-graph-scraper';

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
      throw new ValidationError('URL을 찾을 수 없습니다');
    }

    try {
      new URL(url);
    } catch {
      throw new ValidationError('유효하지 않은 URL입니다');
    }

    const { result } = await ogs({
      url,
      fetchOptions: {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        },
        signal: AbortSignal.timeout(5000),
      },
    });

    if (!result.success) {
      throw new ExternalServiceError('OG 데이터를 가져올 수 없습니다');
    }

    const ogImage = result.ogImage?.[0];

    return NextResponse.json(
      {
        data: {
          title: result.ogTitle || result.twitterTitle || null,
          description:
            result.ogDescription || result.twitterDescription || null,
          image: ogImage?.url || null,
          siteName: result.ogSiteName || null,
          favicon: result.favicon || null,
          url: result.ogUrl || url,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      }
    );
  } catch (error) {
    console.error('OG 파싱 에러', error);

    if (error instanceof ApiError) {
      return error.toResponse();
    }

    return NextResponse.json(
      { error: 'OG 데이터를 가져오는 데에 실패했습니다' },
      { status: 500 }
    );
  }
}
