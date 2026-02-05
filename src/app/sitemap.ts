import { supabase } from '@/lib/supabase';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: posts } = await supabase
    .from('posts')
    .select('id, updated_at')
    .eq('visibility', 'public');

  const postUrls =
    posts?.map(post => ({
      url: `https://sharetext.app/read/${post.id}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : undefined,
    })) ?? [];

  return [
    {
      url: 'https://sharetext.app',
      lastModified: new Date(),
    },
    ...postUrls,
  ];
}
