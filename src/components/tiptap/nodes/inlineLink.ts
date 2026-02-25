import Link from '@tiptap/extension-link';

export default Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      isNewlyInserted: {
        default: true,
      },
    };
  },
});
