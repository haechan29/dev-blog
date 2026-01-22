'use client';

import { CreatorDetail } from '@/components/creator/creatorDetail';
import { CreatorFormDialog } from '@/components/creator/creatorFormDialog';
import { CreatorList } from '@/components/creator/creatorList';
import { DeleteCreatorDialog } from '@/components/creator/deleteCreatorDialog';
import { EmailFormDialog } from '@/components/creator/emailFormDialog';
import { ApiError } from '@/errors/errors';
import { Creator } from '@/features/creator/domain/model/creator';
import * as OutreachEmailClientRepository from '@/features/outreach-email/data/repository/outreachEmailClientRepository';
import { OutreachEmail } from '@/features/outreach-email/domain/model/outreachEmail';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

export function CreatorPageClient({
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
  const [emails, setEmails] = useState<OutreachEmail[]>([]);
  const [isEmailsLoading, setIsEmailsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const selectedCreator = useMemo(() => {
    return creators.find(c => c.id === selectedCreatorId) ?? null;
  }, [creators, selectedCreatorId]);
  const latestReceivedEmail = useMemo(() => {
    return emails.find(e => e.direction === 'received') ?? null;
  }, [emails]);

  const handleCreate = useCallback(() => {
    setFormMode('create');
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((id: string) => {
    setSelectedCreatorId(id);
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

  const handleDelete = useCallback((id: string) => {
    setDeleteTargetId(id);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteSuccess = useCallback(() => {
    if (deleteTargetId === selectedCreatorId) {
      setSelectedCreatorId(null);
    }
    setCreators(prev => prev.filter(c => c.id !== deleteTargetId));
    setDeleteTargetId(null);
  }, [deleteTargetId, selectedCreatorId]);

  const fetchEmails = useCallback(async (creatorId: string) => {
    setIsEmailsLoading(true);
    try {
      const data =
        await OutreachEmailClientRepository.getOutreachEmails(creatorId);
      setEmails(data);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : '댓글 삭제에 실패했습니다';
      toast.error(message);
    } finally {
      setIsEmailsLoading(false);
    }
  }, []);

  const handleSendEmail = useCallback(() => {
    setIsEmailFormOpen(true);
  }, []);

  const handleSendEmailSuccess = useCallback(() => {
    if (selectedCreatorId) {
      fetchEmails(selectedCreatorId);
    }
  }, [fetchEmails, selectedCreatorId]);

  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result = await OutreachEmailClientRepository.syncOutreachEmails();
      toast.success(`${result.synced}개 이메일 동기화 완료`);
      if (selectedCreatorId) {
        fetchEmails(selectedCreatorId);
      }
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '이메일 동기화에 실패했습니다';
      toast.error(message);
    } finally {
      setIsSyncing(false);
    }
  }, [selectedCreatorId, fetchEmails]);

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
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreatorDetail
        creator={selectedCreator}
        emails={emails}
        isEmailsLoading={isEmailsLoading}
        onSendEmail={handleSendEmail}
        onSync={handleSync}
        isSyncing={isSyncing}
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
          latestReceivedEmail={latestReceivedEmail}
          isOpen={isEmailFormOpen}
          setIsOpen={setIsEmailFormOpen}
          onSuccess={handleSendEmailSuccess}
        />
      )}

      {deleteTargetId && (
        <DeleteCreatorDialog
          creatorId={deleteTargetId}
          creatorName={
            creators.find(c => c.id === deleteTargetId)?.channelName ?? ''
          }
          isOpen={isDeleteDialogOpen}
          setIsOpen={setIsDeleteDialogOpen}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
}
