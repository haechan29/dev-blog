import CodeBlock from '@/components/tiptap/editor/views/codeBlock';
import BaseCodeBlock from '@tiptap/extension-code-block';
import { ReactNodeViewRenderer } from '@tiptap/react';

export default BaseCodeBlock.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlock);
  },
}).configure({
  enableTabIndentation: true,
});
