import { mdxComponents } from '@/lib/mdx/mdxComponents';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import { PluggableList } from 'unified';

const TEXT_TAGS = ['p', 'br'];
const EMPHASIS_TAGS = ['strong', 'b', 'em', 'i'];
const STRIKETHROUGH_TAGS = ['del', 's'];
const HEADING_TAGS = ['h1', 'h2', 'h3'];
const LINK_TAGS = ['a'];
const LIST_TAGS = ['ul', 'ol', 'li'];
const CODE_TAGS = ['code', 'pre', 'span'];
const QUOTATION_TAGS = ['blockquote'];

export const allowedSchema = {
  tagNames: [
    ...TEXT_TAGS,
    ...EMPHASIS_TAGS,
    ...STRIKETHROUGH_TAGS,
    ...HEADING_TAGS,
    ...LINK_TAGS,
    ...LIST_TAGS,
    ...CODE_TAGS,
    ...QUOTATION_TAGS,
    ...Object.keys(mdxComponents),
  ],
  attributes: {
    h1: ['id'],
    h2: ['id'],
    h3: ['id'],
    a: ['href'],
    code: ['className', 'data-*'],
    pre: ['className'],
    span: ['className'],
    ...Object.fromEntries(Object.keys(mdxComponents).map(key => [key, ['*']])),
  },
};

export const mdxOptions = {
  rehypePlugins: [
    [rehypeSanitize, allowedSchema],
    rehypePrettyCode,
    rehypeSlug,
  ] as PluggableList,
};
