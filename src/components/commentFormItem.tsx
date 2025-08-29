'use client';

import React, { useMemo, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import clsx from 'clsx';
import CommentItem from './commentItem';

interface CommentProps {
  postId: string;
}

interface Comment {
  id: number;
  postId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// 가짜 데이터
const mockComments: Comment[] = [
  {
    id: 1,
    postId: 'sample-post',
    authorName: '김개발',
    content: '정말 유용한 글이네요! 특히 타입스크립트 부분이 도움이 많이 되었습니다. 실무에서 바로 적용해보겠어요.',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    postId: 'sample-post',
    authorName: '프론트엔더',
    content: 'Next.js 15 정보 감사합니다! 마침 프로젝트에서 업그레이드를 고민하고 있었는데 많은 도움이 되었어요.',
    createdAt: '2024-01-15T14:20:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: 3,
    postId: 'sample-post',
    authorName: '신입개발자',
    content: '초보자도 이해하기 쉽게 설명해주셔서 감사합니다. 계속 좋은 글 부탁드려요!',
    createdAt: '2024-01-15T16:45:00Z',
    updatedAt: '2024-01-15T16:45:00Z'
  }
];

export default function CommentFormItem({ postId }: CommentProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [authorName, setAuthorName] = useState('익명');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [isAuthorNameValid, setIsAuthorNameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isContentValid, setIsContentValid] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{show: boolean, commentId: number | null}>({
    show: false,
    commentId: null
  });
  const [deletePassword, setDeletePassword] = useState('');

  // 댓글 작성
  const handleSubmit = () => {
    if (!authorName.trim()) {
      setIsAuthorNameValid(false);
      setIsPasswordValid(true);
      setIsContentValid(true);
      return;
    }

    if (!password.trim()) {
      setIsAuthorNameValid(true);
      setIsPasswordValid(false);
      setIsContentValid(true);
      return;
    }

    if (!content.trim()) {
      setIsAuthorNameValid(true);
      setIsPasswordValid(true);
      setIsContentValid(false);
      return;
    }
    
    const newCommentData: Comment = {
      id: Date.now(),
      postId,
      authorName,
      content: content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setComments([newCommentData, ...comments]);
    setContent('');
    setAuthorName('');
    setPassword('');
  };

  return (
    <div>
      <div className="text-xl font-bold text-gray-900 mb-8">
        댓글 {comments.length}개
      </div>

      <div className="space-y-4 mb-14">
        <div className="flex space-x-4">
          <input
            type="text"
            value={authorName}
            onChange={(e) => {
              setIsAuthorNameValid(true);
              setAuthorName(e.target.value);
            }}
            placeholder="이름"
            className={clsx(
              "flex-1 p-3 outline-none border rounded-lg",
              isAuthorNameValid ? 'border-gray-300 hover:border-blue-500 focus:border-blue-500': 'border-red-400 animate-shake',
              authorName ? 'bg-white' : 'bg-gray-50'
            )}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setIsPasswordValid(true);
              setPassword(e.target.value);
            }}
            placeholder="비밀번호"
            className={clsx(
              "flex-1 p-3 outline-none border rounded-lg",
              isPasswordValid ? 'border-gray-300 hover:border-blue-500 focus:border-blue-500': 'border-red-400 animate-shake',
              password ? 'bg-white' : 'bg-gray-50'
            )}
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => {
            setIsContentValid(true);
            setContent(e.target.value);
          }}
          placeholder="댓글을 작성해주세요"
          className={clsx(
            "w-full p-4 resize-none outline-none border rounded-lg overflow-y-hidden",
            isContentValid ? 'border-gray-300 hover:border-blue-500 focus:border-blue-500': 'border-red-400 animate-shake',
            content ? 'bg-white' : 'bg-gray-50'
          )}
          rows={4}
        />
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className={clsx(
              "flex items-center space-x-2 px-6 py-3 text-white rounded-lg bg-blue-600 hover:bg-blue-500 cursor-pointer transition-colors",
            )}
          >
            <Send size={18} />
            <div className='font-bold'>댓글 작성</div>
          </button>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg">아직 댓글이 없습니다.</p>
            <p className="text-gray-400">첫 번째 댓글을 작성해보세요!</p>
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
            />
          ))
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">댓글 삭제</h3>
              <button
                onClick={() => {
                  setDeleteModal({ show: false, commentId: null });
                  setDeletePassword('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">정말로 이 댓글을 삭제하시겠습니까?</p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => 'deleteComment'}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                삭제
              </button>
              <button
                onClick={() => {
                  setDeleteModal({ show: false, commentId: null });
                  setDeletePassword('');
                }}
                className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}