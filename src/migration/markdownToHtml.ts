import {
  remarkInsPosition,
  remarkSpacer,
  remarkTextBreaks,
  remarkTextPosition,
} from '@/lib/md/remark';
import { rehypeInsToU } from '@/migration/rehypeHtmlMigration';
import {
  remarkDialogueHtmlMigration,
  remarkImgHtmlMigration,
  remarkRemoveBgm,
  remarkSpacerHtmlMigration,
} from '@/migration/remarkHtmlMigration';
import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkIns from 'remark-ins';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { VFile } from 'vfile';

export async function markdownToHtml(source: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm, { singleTilde: false })
    .use(remarkIns)
    .use(remarkInsPosition)
    .use(remarkTextPosition)
    .use(remarkTextBreaks)
    .use(remarkSpacer)
    .use(remarkSpacerHtmlMigration)
    .use(remarkDirective)
    .use(remarkImgHtmlMigration)
    .use(remarkRemoveBgm)
    .use(remarkDialogueHtmlMigration)
    .use(remarkRehype)
    .use(rehypeInsToU)
    .use(rehypeStringify);

  const file = new VFile(source);
  const result = await processor.process(file);

  return String(result);
}
