const IMG_DIRECTIVE_REGEX = /:::img\{url="([^"]+)"[^}]*\}/g;

export function extractImageUrls(content: string): string[] {
  const urls: string[] = [];
  let match;

  while ((match = IMG_DIRECTIVE_REGEX.exec(content)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}
