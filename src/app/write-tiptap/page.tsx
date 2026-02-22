'use client';

import TiptapEditor from '@/components/tiptap/tiptapEditor';
import * as PostClientService from '@/features/post/domain/service/postClientService';
import { JSONContent } from '@tiptap/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function WriteTiptapPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (json: JSONContent) => {
    setIsSaving(true);
    try {
      const post = await PostClientService.createPost({
        title: '임시 제목', // TODO: 제목 입력 UI 추가
        content: '', // tiptap에서는 content_json 사용
        contentJson: json,
        tags: [],
        password: '',
        visibility: 'public',
      });
      router.push(`/read/${post.id}`);
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='h-screen p-4'>
      <h1 className='text-xl font-bold mb-4'>Tiptap 에디터 테스트</h1>
      <div className='h-[calc(100%-3rem)]'>
        <TiptapEditor onSave={handleSave} />
      </div>
    </div>
  );
}
