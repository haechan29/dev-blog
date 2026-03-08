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

    const ogsResult = await tryOgs(url);
    if (ogsResult) {
      return NextResponse.json(
        { data: ogsResult },
        { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=86400' } }
      );
    }

    const linkMetaResult = await tryLinkMeta(url);
    if (linkMetaResult) {
      return NextResponse.json(
        { data: linkMetaResult },
        { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=86400' } }
      );
    }

    throw new ExternalServiceError('OG 데이터를 가져올 수 없습니다');
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

async function tryOgs(url: string) {
  try {
    const { result } = await ogs({
      url,
      fetchOptions: {
        headers: {
          'user-agent':
            'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'accept-language': 'en-US,en;q=0.5',
        },
        signal: AbortSignal.timeout(5000),
      },
    });

    if (!result.success) return null;

    const title = result.ogTitle || result.twitterTitle;
    const ogImage = result.ogImage?.[0];
    if (!title || !ogImage?.url) return null;

    return {
      title,
      description: result.ogDescription || result.twitterDescription || null,
      image: ogImage.url,
      siteName: result.ogSiteName || null,
    };
  } catch {
    return null;
  }
}

async function tryLinkMeta(url: string) {
  try {
    const response = await fetch(
      `https://linkmeta.dev/api/v1/extract?url=${encodeURIComponent(url)}`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (!response.ok) return null;

    const json = await response.json();
    if (json.status !== 'success' || !json.data) return null;

    const data = json.data;
    if (!data.title || !data.image) return null;

    return {
      title: data.title,
      description: data.description || null,
      image: data.image,
      siteName: data.siteName || null,
    };
  } catch {
    return null;
  }
}

function isAllowedUrl(urlString: string): boolean {
  const url = new URL(urlString);

  if (url.protocol !== 'https:') return false;

  const hostname = url.hostname;

  if (hostname === 'localhost') return false;
  if (hostname.startsWith('127.')) return false;
  if (hostname.startsWith('192.168.')) return false;
  if (hostname.startsWith('10.')) return false;
  if (hostname.match(/^172\.(1[6-9]|2[0-9]|3[01])\./)) return false;
  if (hostname === '169.254.169.254') return false;

  return true;
}
