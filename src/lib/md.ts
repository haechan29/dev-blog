import {
  handleDirective,
  handleImage,
  handleLink,
  schema,
} from '@/lib/mdConfig';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkBreaks from 'remark-breaks';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const processor = unified()
  .use(remarkParse) // parse markdown text into AST
  .use(remarkGfm) // support GitHub flavored markdown (tables, strikethrough, etc)
  .use(remarkBreaks) // convert line breaks to br tags
  .use(remarkDirective) // support custom directives like :::page
  .use(handleDirective) // process custom directives
  .use(handleImage) // process custom image directives
  .use(remarkRehype) // convert markdown AST to HTML AST
  .use(rehypeSanitize, schema) // remove unsafe HTML tags and attributes
  .use(handleLink) // process links
  .use(rehypePrettyCode) // add syntax highlighting to code blocks
  .use(rehypeSlug) // add id attributes to headings
  .use(rehypeStringify); // convert HTML AST to HTML string

export async function processMd(source: string) {
  const result = await processor.process(source);
  return String(result);
}
