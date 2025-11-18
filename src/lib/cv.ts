import { type ClassValue, clsx } from 'clsx';

export function cv(variant: string, ...classes: ClassValue[]) {
  const classString = clsx(...classes);
  return classString
    .split(' ')
    .filter(Boolean)
    .map(cls => `${variant}:${cls}`)
    .join(' ');
}
