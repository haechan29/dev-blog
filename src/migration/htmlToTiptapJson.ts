import BgmNode from '@/migration/nodes/bgm';
import DialogueNode from '@/migration/nodes/dialogue';
import ImageWithCaptionNode from '@/migration/nodes/imageWithCaption';
import type { JSONContent } from '@tiptap/core';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { generateJSON } from '@tiptap/html/server';
import StarterKit from '@tiptap/starter-kit';

export function htmlToTiptapJson(html: string): JSONContent {
  return generateJSON(html, [
    StarterKit,
    Table,
    TableRow,
    TableHeader,
    TableCell,
    // 레거시에는 linkCard 가 없으므로 포함하지 않는다.
    ImageWithCaptionNode,
    DialogueNode,
    BgmNode,
  ]);
}
