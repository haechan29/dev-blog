const R2_URL_REGEX = /https:\/\/images\.sharetext\.app\/[^\s"')\}\]]+/g;

export function extractImageUrls(content: string): string[] {
  const matches = content.match(R2_URL_REGEX);
  return matches ? [...new Set(matches)] : [];
}
