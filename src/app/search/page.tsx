'use client';

import SearchAutocomplete from '@/components/search/searchAutocomplete';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  if (query) {
    return <></>;
  }

  return <SearchAutocomplete />;
}
