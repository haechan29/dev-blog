const IMAGE_DIRECTIVE_PATTERN = ':::img[\\s\\S]*?:::';
const BGM_DIRECTIVE_PATTERN = '::bgm\\{[^}]*\\}';
const CODE_PATTERN = '```[\\s\\S]*?```';

export function parseRanges(text: string, type: string) {
  if (type === 'image' || type === 'bgm') {
    return parseDirectiveRanges(text, type);
  } else if (type === 'table') {
    return parseTableRanges(text);
  } else if (type === 'code') {
    return parseCodeRanges(text);
  }
}

export function parseDirectiveRanges(text: string, type: string) {
  let regex: RegExp;
  if (type === 'image') {
    regex = new RegExp(IMAGE_DIRECTIVE_PATTERN, 'g');
  } else if (type === 'bgm') {
    regex = new RegExp(BGM_DIRECTIVE_PATTERN, 'g');
  } else {
    return [];
  }

  const matches = [...text.matchAll(regex)];
  return matches.map(match => [match.index, match.index + match[0].length]);
}

export function parseTableRanges(text: string) {
  const lines = text.split('\n');
  const ranges: number[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (/^\|[\s\-\|]+\|$/.test(line) && line.includes('-')) {
      let start = i - 1;
      while (start >= 0 && lines[start].trim().includes('|')) {
        start--;
      }
      start++;

      let end = i + 1;
      while (end < lines.length && lines[end].trim().includes('|')) {
        end++;
      }

      const startIndex =
        lines.slice(0, start).join('\n').length + (start > 0 ? 1 : 0);
      const endIndex = lines.slice(0, end).join('\n').length;

      ranges.push([startIndex, endIndex]);
    }
  }

  return ranges;
}

export function parseCodeRanges(text: string) {
  const codeBlockRegex = new RegExp(CODE_PATTERN, 'g');
  const matches = [...text.matchAll(codeBlockRegex)];
  return matches.map(match => [match.index, match.index + match[0].length]);
}

export function addRow(tableText: string) {
  const firstLine = tableText.match(/^.*$/m)?.[0];
  if (!firstLine) return { newTable: tableText, cursorPosition: 0 };

  const index = (firstLine.match(/\|/g) || []).length - 1;
  const cells = Array.from({ length: index }, (_, i) => `내용${i + 1}`);
  const newRow = `| ${cells.join(' | ')} |\n`;

  const newTable = tableText + '\n' + newRow;
  const cursorPosition =
    tableText.length + 1 + newRow.indexOf('내용1') + '내용1'.length;

  return { newTable, cursorPosition };
}

export function addColumn(tableText: string) {
  const lines = tableText.split('\n').filter(line => line.trim());
  const index = lines[0].trim().split('|').length - 1;
  lines[0] += ` 제목${index} |\n`;
  lines[1] += '-------|\n';
  for (let i = 2; i < lines.length; i++) {
    lines[i] += ` 내용${index} |\n`;
  }

  const newTable = lines.join('');
  const targetText = `제목${index}`;
  const cursorPosition = newTable.indexOf(targetText) + targetText.length;
  return { newTable, cursorPosition };
}
