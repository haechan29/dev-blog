import clsx from 'clsx';
import Image from 'next/image';

export default function ImageWithCaption({
  src,
  'data-size': size,
  'data-caption': caption,
  alt = '',
}: {
  src: string;
  'data-size': 'medium' | 'large';
  'data-caption': string;
  alt?: string;
}) {
  const newCaptions = caption
    .replace(/\\#/g, '__ESCAPED_HASH__')
    .replace(/#/g, '')
    .replace(/__ESCAPED_HASH__/g, '#')
    .split('\n');

  return (
    <div className='flex flex-col'>
      <Image
        src={src}
        alt={alt}
        width={1000}
        height={1000}
        className={clsx(
          'h-auto',
          size === 'large' ? 'w-full' : 'min-w-56 w-1/2'
        )}
      />
      {newCaptions.map((caption, index) => (
        <div key={`${caption}-${index}`}>{caption}</div>
      ))}
    </div>
  );
}
