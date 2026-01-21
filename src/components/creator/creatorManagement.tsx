'use client';

import { CreatorDetail } from '@/components/creator/creatorDetail';
import { CreatorList } from '@/components/creator/creatorList';
import { Creator } from '@/features/creator/domain/model/creator';
import { useState } from 'react';

export function CreatorManagement({
  initialCreators,
}: {
  initialCreators: Creator[];
}) {
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(
    null
  );
  const [creators, setCreators] = useState(initialCreators);

  const selectedCreator =
    creators.find(c => c.id === selectedCreatorId) ?? null;

  return (
    <>
      <CreatorList
        creators={creators}
        selectedId={selectedCreatorId}
        onSelect={setSelectedCreatorId}
      />
      <CreatorDetail creator={selectedCreator} />
    </>
  );
}
