import { CreatorPageClient } from '@/components/creator/creatorPageClient';
import * as CreatorServerRepository from '@/features/creator/data/repository/creatorServerRepository';

export default async function CreatorsPage() {
  const creators = await CreatorServerRepository.getCreators();

  return (
    <div className='min-h-screen flex'>
      <CreatorPageClient initialCreators={creators} />
    </div>
  );
}
