import CodeBlockView from '@/components/tiptap/editor/views/codeBlock';
import CodeBlock from '@tiptap/extension-code-block';
import { ReactNodeViewRenderer } from '@tiptap/react';

export default CodeBlock.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView);
  },
}).configure({
  enableTabIndentation: true,
});
