import Bgm from '@/components/md/bgm';
import ExternalLink from '@/components/md/externalLink';
import ImageWithCaption from '@/components/md/imageWithCaption';
import Spacer from '@/components/md/spacer';
import { rehypeOffset, rehypeTagName, schema } from '@/lib/md/rehype';
import {
  remarkBgm,
  remarkImg,
  remarkSpacer,
  remarkTextBreaks,
} from '@/lib/md/remark';
import { createElement, Fragment, JSX } from 'react';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeReact from 'rehype-react';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const processor = unified()
  .use(remarkParse) // parse markdown text into AST
  .use(remarkGfm) // support GitHub flavored markdown (tables, strikethrough, etc)
  .use(remarkTextBreaks) // convert line breaks within text content to break nodes
  .use(remarkSpacer) // convert line breaks between block elements to spacer nodes
  .use(remarkDirective) // support custom directives like :::bgm
  .use(remarkImg) // process img nodes
  .use(remarkBgm) // process bgm nodes
  .use(remarkRehype) // convert markdown AST to HTML AST
  .use(rehypeSanitize, schema) // remove unsafe HTML tags and attributes
  .use(rehypePrettyCode) // add syntax highlighting to code blocks
  .use(rehypeSlug) // add id attributes to headings
  .use(rehypeOffset) // add offset attribute to element
  .use(rehypeTagName) // set tag name to custom elements
  .use(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rehypeReact as any, // convert HTML AST to React components
    {
      createElement,
      Fragment,
      components: {
        a: ExternalLink,
        bgm: Bgm,
        img: ImageWithCaption,
        spacer: Spacer,
      },
    }
  );

export async function processMd(source: string) {
  const result = await processor.process(source);
  return result.result as JSX.Element;
}
