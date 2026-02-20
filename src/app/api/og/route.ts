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

    if (!isAllowedUrl(url)) {
      throw new ValidationError('허용되지 않는 URL입니다');
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
          'Cache-Control': 'public, max-age=0, s-maxage=86400',
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

function isAllowedUrl(urlString: string): boolean {
  const url = new URL(urlString);

  if (url.protocol !== 'https:') return false;

  const hostname = url.hostname;

  if (hostname === 'localhost') return false;
  if (hostname.startsWith('127.')) return false; // localhost의 IP 버전 (loopback 주소)
  if (hostname.startsWith('192.168.')) return false; // 192.168.x.x: 가정용 공유기에서 흔히 쓰는 사설 IP 대역
  if (hostname.startsWith('10.')) return false; // 10.x.x.x: 회사나 클라우드에서 흔히 쓰는 사설 IP 대역
  if (hostname.match(/^172\.(1[6-9]|2[0-9]|3[01])\./)) return false; // 172.16.x.x ~ 172.31.x.x: 또 다른 사설 IP 대역
  if (hostname === '169.254.169.254') return false; // 169.254.169.254: 클라우드 메타데이터 서버 주소

  return true;
}
