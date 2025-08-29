'use client';

import { useState } from 'react';
import { Heart, Edit2, Trash2 } from 'lucide-react';

interface Comment {
  id: number;
  postId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {comment.authorName.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{comment.authorName}</h4>
            <p className="text-sm text-gray-500">
              {formatTime(comment.createdAt)}
              {comment.updatedAt !== comment.createdAt && (
                <span className="ml-1 text-gray-400">(수정됨)</span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => 'startEdit(comment)'}
            className="text-gray-400 hover:text-blue-600 transition-colors p-1"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => 'setDeleteModal({ show: true, commentId: comment.id })'}
            className="text-gray-400 hover:text-red-600 transition-colors p-1"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* 댓글 내용 / 수정 폼 */}
      {'editingId'.length === comment.id ? (
        <div className="space-y-3">
          <textarea
            value={'editContent'}
            onChange={(e) => 'setEditContent(e.target.value)'}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
          />
          <input
            type="password"
            value={'editPassword'}
            onChange={(e) => 'setEditPassword(e.target.value)'}
            placeholder="비밀번호"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex space-x-2">
            <button
              onClick={() => 'completeEdit(comment.id)'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              저장
            </button>
            <button
              onClick={() => {
                // setEditingId(null);
                // setEditContent('');
                // setEditPassword('');
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-800 leading-relaxed mb-4">{comment.content}</p>
      )}

      {/* 좋아요 버튼 */}
      <div className="flex items-center space-x-4 pt-2">
        <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
          <Heart size={16} />
          <span className="text-sm">0</span>
        </button>
      </div>
    </div>
  );
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return '방금 전';
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  if (diffInMinutes < 60 * 24) return `${Math.floor(diffInMinutes / 60)}시간 전`;
  return date.toLocaleDateString('ko-KR');
};