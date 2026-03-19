import { NodeViewWrapper } from '@tiptap/react';

export default function HorizontalRule() {
  return (
    <NodeViewWrapper className='py-4'>
      <div className='w-full h-px bg-gray-200' />
    </NodeViewWrapper>
  );
}
