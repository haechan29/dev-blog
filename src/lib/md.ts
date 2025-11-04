import Bgm from '@/components/md/bgm';
import ExternalLink from '@/components/md/externalLink';
import ImageWithCaption from '@/components/md/imageWithCaption';
import {
  rehypeBgm,
  remarkBgm,
  remarkBreaks,
  remarkImg,
  schema,
} from '@/lib/mdConfig';
import React, { JSX } from 'react';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeReact from 'rehype-react';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export const LINE_BREAK_MARKER = '{{LINE_BREAK}}';

const processor = unified()
  .use(remarkParse) // parse markdown text into AST
  .use(remarkGfm) // support GitHub flavored markdown (tables, strikethrough, etc)
  .use(remarkBreaks) // convert line breaks to br tags
  .use(remarkDirective) // support custom directives like :::bgm
  .use(remarkImg) // process img nodes
  .use(remarkBgm) // process bgm nodes
  .use(remarkRehype) // convert markdown AST to HTML AST
  .use(rehypeSanitize, schema) // remove unsafe HTML tags and attributes
  .use(rehypePrettyCode) // add syntax highlighting to code blocks
  .use(rehypeSlug) // add id attributes to headings
  .use(rehypeBgm) // process bgm elements
  .use(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rehypeReact as any, // convert HTML AST to React components
    {
      createElement: React.createElement,
      components: {
        a: ExternalLink,
        bgm: Bgm,
        img: ImageWithCaption,
      },
    }
  );

export async function processMd(source: string) {
  const newSource = processLineBreaks(source);
  const result = await processor.process(newSource);
  return result.result as JSX.Element;
}

function processLineBreaks(source: string) {
  return source.replace(/\n+/g, match => {
    return LINE_BREAK_MARKER.repeat(match.length) + '\n\n';
  });
}
