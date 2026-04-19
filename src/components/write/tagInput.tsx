'use client';

import { useEffect, useRef, useState } from 'react';

export default function TagInput({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue('');
    setIsEditing(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Escape') {
      setInputValue('');
      setIsEditing(false);
    }
  };

  return (
    <div className='flex flex-wrap gap-3'>
      {tags.map(tag => (
        <button
          key={tag}
          type='button'
          onClick={() => removeTag(tag)}
          className='text-xs px-2 py-1 border border-gray-300 rounded-full whitespace-nowrap hover:border-red-300 hover:text-red-500 cursor-pointer'
        >
          {tag}
        </button>
      ))}

      {isEditing ? (
        <div className='relative'>
          <div className='invisible text-xs px-2 py-1 border border-gray-300 rounded-full whitespace-nowrap'>
            {inputValue || '태그'}
          </div>
          <input
            ref={inputRef}
            type='text'
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            maxLength={20}
            onBlur={addTag}
            onKeyDown={handleKeyDown}
            className='absolute inset-0 text-xs px-2 py-1 border border-gray-300 rounded-full outline-none'
          />
        </div>
      ) : tags.length < 10 ? (
        <button
          type='button'
          onClick={() => setIsEditing(true)}
          className='text-xs px-2 py-1 border border-dashed border-gray-300 rounded-full text-gray-400 hover:border-gray-400 hover:text-gray-500 cursor-pointer'
        >
          + 태그 추가
        </button>
      ) : null}
    </div>
  );
}
