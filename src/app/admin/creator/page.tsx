import { CreatorPageClient } from '@/components/creator/creatorPageClient';
import * as CreatorServerRepository from '@/features/creator/data/repository/creatorServerRepository';

export default async function CreatorPage() {
  const creators = await CreatorServerRepository.getCreators();

  return (
    <div className='h-screen flex'>
      <CreatorPageClient initialCreators={creators} />
    </div>
  );
}
