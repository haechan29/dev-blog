import { createDirectiveHandler } from '@/lib/mdConfig';
import rehypePrettyCode from 'rehype-pretty-code';
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
  .use(createDirectiveHandler)
  .use(remarkRehype)
  .use(rehypePrettyCode)
  .use(rehypeSlug)
  .use(rehypeStringify);
