import { handleDirective, handleLink } from '@/lib/mdConfig';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkBreaks from 'remark-breaks';
import remarkDirective from 'remark-directive';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const processor = unified()
  .use(remarkParse)
  .use(remarkBreaks)
  .use(remarkDirective)
  .use(handleDirective)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(handleLink)
  .use(rehypePrettyCode)
  .use(rehypeSlug)
  .use(rehypeStringify);

export async function processMd(source: string) {
  const result = await processor.process(source);
  return String(result);
}
