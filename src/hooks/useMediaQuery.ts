import { useLayoutEffect, useState } from 'react';

export default function useMediaQuery(query: string) {
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
