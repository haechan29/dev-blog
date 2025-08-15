"use client";

import clsx from 'clsx';
import { useState } from 'react';

export default function ProjectItem() {
  const [platforms, _] = useState(['Android', 'React', 'Flutter']);
  const [selectedPlatform, setSelectedPlatform] = useState('Android');

  return (
    <div className='flex flex-col'>
      <div className='flex'>
        {platforms.map(((platform, i) => {
          return (
            <div key={platform} className='flex text-xl font-bold'>
              <button 
                onClick={() => setSelectedPlatform(platform)}
                className={clsx(
                  'hover:text-blue-500',
                  i === 0 ? 'pr-2' : 'px-2',
                  platform === selectedPlatform ? 'text-blue-500' : 'text-gray-300'
                )}
              >
                {platform}
              </button>
              {i !== platforms.length - 1 && (
                <div className='text-gray-300'>/</div>
              )}
            </div>
          );
        }))}
      </div>

      
    </div>
  );
}