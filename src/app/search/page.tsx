import SearchPageClient from '@/components/search/searchPageClient';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return <SearchPageClient initialQuery={q} />;
}
