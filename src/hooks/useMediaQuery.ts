import { useLayoutEffect, useState } from 'react';

export const TOUCH_QUERY = '(pointer: coarse)';
export const DESKTOP_QUERY = '(min-width: 1280px)';

type MediaQuery = typeof TOUCH_QUERY | typeof DESKTOP_QUERY;

export default function useMediaQuery(query: MediaQuery) {
  const [matches, setMatches] = useState<boolean | undefined>();

  useLayoutEffect(() => {
    const media = window.matchMedia(query);
    const updateMatch = () => setMatches(media.matches);
    updateMatch();
    media.addEventListener('change', updateMatch);
    return () => media.removeEventListener('change', updateMatch);
  }, [query]);

  return matches;
}
