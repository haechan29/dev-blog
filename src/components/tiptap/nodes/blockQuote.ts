import { Blockquote } from '@tiptap/extension-blockquote';

export default Blockquote.extend({
  content: '(paragraph | imageWithCaption)*',
});
