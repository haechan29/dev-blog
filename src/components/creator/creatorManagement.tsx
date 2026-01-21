'use client';

import { CreatorDetail } from '@/components/creator/creatorDetail';
import { CreatorFormDialog } from '@/components/creator/creatorFormDialog';
import { CreatorList } from '@/components/creator/creatorList';
import { Creator } from '@/features/creator/domain/model/creator';
import { useCallback, useMemo, useState } from 'react';

export function CreatorManagement({
  initialCreators,
}: {
  initialCreators: Creator[];
}) {
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(
    null
  );
  const [creators, setCreators] = useState(initialCreators);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const selectedCreator = useMemo(() => {
    return creators.find(c => c.id === selectedCreatorId) ?? null;
  }, [creators, selectedCreatorId]);

  const handleCreate = useCallback(() => {
    setFormMode('create');
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback(() => {
    setFormMode('edit');
    setIsFormOpen(true);
  }, []);

  const handleFormSuccess = useCallback(
    (creator: Creator) => {
      if (formMode === 'create') {
        setCreators(prev => [creator, ...prev]);
        setSelectedCreatorId(creator.id);
      } else {
        setCreators(prev => prev.map(c => (c.id === creator.id ? creator : c)));
      }
    },
    [formMode]
  );

  return (
    <>
      <CreatorList
        creators={creators}
        selectedId={selectedCreatorId}
        onSelect={setSelectedCreatorId}
        onCreate={handleCreate}
      />
      <CreatorDetail creator={selectedCreator} onEdit={handleEdit} />

      <CreatorFormDialog
        mode={formMode}
        creator={selectedCreator}
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        onSuccess={handleFormSuccess}
      />
    </>
  );
}
