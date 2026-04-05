export default function BellIcon({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
    >
      <path d='M12 3C9.4 3 6 5.5 6 11v3.5c0 .8-.3 1.5-.8 2-.3.3-.2.8.1 1 .1.1.3.1.5.1h12.4c.2 0 .4 0 .5-.1.3-.2.4-.7.1-1-.5-.5-.8-1.2-.8-2V11c0-5.5-3.4-8-6-8z' />
      <path d='M9.5 18.5c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5' />
    </svg>
  );
}
