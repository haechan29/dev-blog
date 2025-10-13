'use client';

import ToggleButton from '@/components/mdx/toggleButton';

interface SummaryPairProps {
  title: string;
  contents: string[];
}

export default function Summary({
  summaryPairs,
}: {
  summaryPairs: SummaryPairProps[];
}) {
  return (
    <div className='flex flex-col w-fit border border-gray-200 rounded-sm gap-y-2 p-6'>
      {summaryPairs.map(summaryItem => (
        <SummaryPair
          key={`${summaryItem.title}-${summaryItem.contents.join()}`}
          {...summaryItem}
        />
      ))}
    </div>
  );
}

function SummaryPair({
  title,
  contents,
}: {
  title: string;
  contents: string[];
}) {
  return (
    <div className='flex flex-col items-start'>
      <div className='text-lg font-semibold mb-2'>{title}</div>
      {contents.map(content => (
        <ToggleButton key={content}>
          <div>{content}</div>
        </ToggleButton>
      ))}
    </div>
  );
}
