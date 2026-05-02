import * as PostQueries from '@/features/post/data/queries/postQueries';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = await PostQueries.fetchPostsForSitemap();

  const postUrls = rows.map(row => ({
    url: `https://sharetext.app/read/${row.id}`,
    lastModified: row.updatedAt ? new Date(row.updatedAt) : undefined,
  }));

  return [
    {
      url: 'https://sharetext.app',
      lastModified: new Date(),
    },
    ...postUrls,
  ];
}
