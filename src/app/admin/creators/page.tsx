import { CreatorPageClient } from '@/components/creator/creatorPageClient';
import * as CreatorServerRepository from '@/features/creator/data/repository/creatorServerRepository';
import { toProps } from '@/features/creator/ui/mapper/creatorMapper';

export default async function CreatorsPage() {
  const creators = await CreatorServerRepository.getCreators().then(creators =>
    creators.map(toProps)
  );

  return (
    <div className='min-h-screen flex'>
      <CreatorPageClient initialCreators={creators} />
    </div>
  );
}
