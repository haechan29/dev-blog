import { rendererExtensions } from '@/features/post/domain/lib/extensions';
import { normalizeText } from '@/lib/text';
import { createClient } from '@supabase/supabase-js';
import { generateText } from '@tiptap/core';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type PostRow = {
  id: string;
  content_json: unknown;
  preview: string | null;
  content_text: string | null;
};

function parseArgs(argv: string[]) {
  const args = new Map<string, string | boolean>();

  for (const raw of argv) {
    if (raw === '--dry-run') {
      args.set('dry-run', true);
      continue;
    }
    if (raw.startsWith('--limit=')) {
      args.set('limit', raw.slice('--limit='.length));
      continue;
    }
    if (raw.startsWith('--max-print=')) {
      args.set('max-print', raw.slice('--max-print='.length));
      continue;
    }
  }

  const dryRun = args.get('dry-run') === true;
  const limitRaw = args.get('limit');
  const limit =
    typeof limitRaw === 'string' && limitRaw.trim() !== ''
      ? Math.max(1, Number(limitRaw))
      : dryRun
        ? 1
        : undefined;

  const maxPrintRaw = args.get('max-print');
  const maxPrint =
    typeof maxPrintRaw === 'string' && maxPrintRaw.trim() !== ''
      ? Math.max(50, Number(maxPrintRaw))
      : 400;

  return { dryRun, limit, maxPrint };
}

function isEmpty(v: string | null | undefined) {
  return v == null || v.trim() === '';
}

function trimForPrint(s: string, max: number) {
  if (s.length <= max) return s;
  return `${s.slice(0, max)}…(총 ${s.length}자)`;
}

async function main() {
  const { dryRun, limit, maxPrint } = parseArgs(process.argv.slice(2));

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL 환경변수가 필요합니다');
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다');
  }

  // preview/content_text 가 null 이거나 빈 문자열인 글만 대상으로 조회
  let query = supabase
    .from('posts')
    .select('id, content_json, preview, content_text')
    .order('created_at', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const targets = (data ?? []) as PostRow[];

  console.log(
    [
      `대상 ${targets.length}개`,
      `mode=${dryRun ? 'dry-run' : 'write'}`,
      limit ? `limit=${limit}` : null,
      `maxPrint=${maxPrint}`,
    ]
      .filter(Boolean)
      .join(' | ')
  );

  let updated = 0;

  for (const p of targets) {
    const raw = generateText(p.content_json as any, rendererExtensions);
    const contentText = normalizeText(raw);
    const preview = contentText.slice(0, 1000);

    const beforePreview = p.preview ?? '';
    const beforeContentText = p.content_text ?? '';

    console.log('---');
    console.log(`id: ${p.id}`);
    console.log(
      `before: preview=${beforePreview.length}자, content_text=${beforeContentText.length}자`
    );
    console.log(
      `after : preview=${preview.length}자, content_text=${contentText.length}자`
    );
    console.log(
      `before.preview: ${trimForPrint(beforePreview.replace(/\s+/g, ' ').trim(), 1000)}`
    );
    console.log(
      `after.preview : ${trimForPrint(preview.replace(/\s+/g, ' ').trim(), 1000)}`
    );
    console.log(
      `after.content_text(sample): ${trimForPrint(
        contentText.replace(/\s+/g, ' ').trim(),
        maxPrint
      )}`
    );

    if (dryRun) {
      continue;
    }

    const { error: updateError } = await supabase
      .from('posts')
      .update({
        content_text: contentText,
        preview,
        updated_at: new Date().toISOString(),
      })
      .eq('id', p.id);

    if (updateError) {
      console.error(`업데이트 실패: ${p.id}`, updateError.message);
      continue;
    }

    updated += 1;
    console.log(`업데이트 완료: ${p.id}`);
  }

  console.log('---');
  console.log(
    dryRun ? 'dry-run 완료' : `완료: ${updated}/${targets.length} 업데이트`
  );
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
