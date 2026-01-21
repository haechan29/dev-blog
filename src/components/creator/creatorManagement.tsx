'use client';

import { CreatorDetail } from '@/components/creator/creatorDetail';
import { CreatorFormDialog } from '@/components/creator/creatorFormDialog';
import { CreatorList } from '@/components/creator/creatorList';
import { EmailFormDialog } from '@/components/creator/emailFormDialog';
import { Creator } from '@/features/creator/domain/model/creator';
import * as OutreachEmailClientRepository from '@/features/outreach-email/data/repository/outreachEmailClientRepository';
import { OutreachEmail } from '@/features/outreach-email/domain/model/outreachEmail';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
  const [emails, setEmails] = useState<OutreachEmail[]>([]);
  const [isEmailsLoading, setIsEmailsLoading] = useState(false);

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

  const handleSendEmail = useCallback(() => {
    setIsEmailFormOpen(true);
  }, []);

  const fetchEmails = useCallback(async (creatorId: string) => {
    setIsEmailsLoading(true);
    try {
      const data =
        await OutreachEmailClientRepository.getOutreachEmails(creatorId);
      setEmails(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEmailsLoading(false);
    }
  }, []);

  const handleSendEmailSuccess = useCallback(() => {
    if (selectedCreatorId) {
      fetchEmails(selectedCreatorId);
    }
  }, [fetchEmails, selectedCreatorId]);

  useEffect(() => {
    if (selectedCreatorId) {
      fetchEmails(selectedCreatorId);
    } else {
      setEmails([]);
    }
  }, [selectedCreatorId, fetchEmails]);

  return (
    <>
      <CreatorList
        creators={creators}
        selectedId={selectedCreatorId}
        onSelect={setSelectedCreatorId}
        onCreate={handleCreate}
      />

      <CreatorDetail
        creator={selectedCreator}
        emails={emails}
        isEmailsLoading={isEmailsLoading}
        onEdit={handleEdit}
        onSendEmail={handleSendEmail}
      />

      <CreatorFormDialog
        mode={formMode}
        creator={selectedCreator}
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        onSuccess={handleFormSuccess}
      />

      {selectedCreator && (
        <EmailFormDialog
          creatorId={selectedCreator.id}
          creatorName={selectedCreator.channelName}
          isOpen={isEmailFormOpen}
          setIsOpen={setIsEmailFormOpen}
          onSuccess={handleSendEmailSuccess}
        />
      )}
    </>
  );
}
