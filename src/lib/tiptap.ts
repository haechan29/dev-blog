import { Editor } from '@tiptap/react';

export function updateNodeById(
  editor: Editor,
  nodeName: string,
  id: string,
  attrs: Record<string, unknown>
) {
  const { state } = editor;
  const { tr } = state;

  state.doc.descendants((node, pos) => {
    if (node.type.name === nodeName && node.attrs.id === id) {
      tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...attrs });
      return false;
    }
  });

  editor.view.dispatch(tr);
}
