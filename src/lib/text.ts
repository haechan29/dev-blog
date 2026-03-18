export function normalizeText(text: string) {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();
}
