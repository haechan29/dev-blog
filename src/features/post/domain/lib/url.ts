import type { JSONContent } from '@tiptap/core';

const R2_URL_REGEX = /https:\/\/images\.sharetext\.app\/[^\s"')\}\]]+/g;

export function extractImageUrls(content: string): string[] {
  const matches = content.match(R2_URL_REGEX);
  return matches ? [...new Set(matches)] : [];
}

export function extractImageUrlsFromJson(json: JSONContent): string[] {
  const urls: string[] = [];

  function traverse(node: JSONContent) {
    if (node.type === 'image' && node.attrs?.src) {
      urls.push(node.attrs.src);
    }
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  }

  traverse(json);
  return [...new Set(urls)];
}
