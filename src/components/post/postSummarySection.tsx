'use client';

import ToggleButtonItem from '@/components/post/toggleButtonItem';

interface PostSummaryItemProps {
  title: string;
  contents: string[];
}

export default function PostSummarySection({
  summaryItems,
}: {
  summaryItems: PostSummaryItemProps[];
}) {
  return (
    <div className='flex w-full min-w-0'>
      <div className='flex flex-col border border-gray-200 rounded-sm gap-y-2 p-6'>
        {summaryItems.map(summaryItem => (
          <div key={summaryItem.title} className='flex flex-col w-full min-w-0'>
            <div className='w-full text-start text-lg font-semibold mb-2'>
              {summaryItem.title}
            </div>
            <div className='flex flex-col w-full min-w-0 items-start'>
              {summaryItem.contents.map(content => (
                <ToggleButtonItem key={content}>
                  <div className='text-start'>{content}</div>
                </ToggleButtonItem>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
