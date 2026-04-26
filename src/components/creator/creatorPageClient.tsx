'use client';

import { CreatorDetail } from '@/components/creator/creatorDetail';
import { CreatorFormDialog } from '@/components/creator/creatorFormDialog';
import { CreatorList } from '@/components/creator/creatorList';
import { DeleteCreatorDialog } from '@/components/creator/deleteCreatorDialog';
import { EmailFormDialog } from '@/components/creator/emailFormDialog';
import { ApiError } from '@/errors/errors';
import * as CreatorAction from '@/features/creator/domain/action/creatorAction';
import { Creator } from '@/features/creator/domain/model/creator';
import { CreatorStatus } from '@/features/creator/domain/type/creatorStatus';
import * as OutreachEmailClientRepository from '@/features/outreach-email/data/repository/outreachEmailClientRepository';
import * as OutreachEmailAction from '@/features/outreach-email/domain/action/outreachEmailAction';
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
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
  const [emails, setEmails] = useState<OutreachEmail[]>([]);
  const [isEmailsLoading, setIsEmailsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

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

  const handleStatusChange = useCallback(
    async (status: CreatorStatus) => {
      if (!selectedCreatorId) return;

      try {
        const updated = await CreatorAction.updateCreator({
          id: selectedCreatorId,
          status,
        });
        setCreators(prev => prev.map(c => (c.id === updated.id ? updated : c)));
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : '상태 변경에 실패했습니다';
        toast.error(message);
      }
    },
    [selectedCreatorId]
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

      if (selectedCreator?.status === 'pending') {
        handleStatusChange('sent');
      }
    }
  }, [
    fetchEmails,
    handleStatusChange,
    selectedCreator?.status,
    selectedCreatorId,
  ]);

  const syncEmails = useCallback(async () => {
    setIsSyncing(true);
    try {
      await OutreachEmailAction.syncOutreachEmails();
      setLastSyncedAt(new Date());
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '이메일 동기화에 실패했습니다';
      toast.error(message);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const fetchUnreadCounts = useCallback(async () => {
    try {
      const counts = await OutreachEmailClientRepository.getUnreadCounts();
      setUnreadCounts(counts);
    } catch {
      toast.error('미열람 이메일 갯수 조회에 실패했습니다');
    }
  }, []);

  const handleMarkAsRead = useCallback(
    async (emailId: string, creatorId: string) => {
      try {
        await OutreachEmailAction.markOutreachEmailAsRead(emailId);
        setUnreadCounts(prev => ({
          ...prev,
          [creatorId]: Math.max((prev[creatorId] || 0) - 1, 0),
        }));
      } catch {
        toast.error('이메일 읽음 처리에 실패했습니다');
      }
    },
    []
  );

  const handleSync = useCallback(async () => {
    await syncEmails();
    if (selectedCreatorId) {
      fetchEmails(selectedCreatorId);
    }
  }, [fetchEmails, selectedCreatorId, syncEmails]);

  useEffect(() => {
    if (selectedCreatorId) {
      fetchEmails(selectedCreatorId);
    } else {
      setEmails([]);
    }
  }, [selectedCreatorId, fetchEmails]);

  useEffect(() => {
    syncEmails();
  }, [syncEmails]);

  useEffect(() => {
    fetchUnreadCounts();
  }, [fetchUnreadCounts]);

  return (
    <>
      <CreatorList
        creators={creators}
        selectedId={selectedCreatorId}
        unreadCounts={unreadCounts}
        onSelect={setSelectedCreatorId}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSync={syncEmails}
        isSyncing={isSyncing}
      />

      <CreatorDetail
        creator={selectedCreator}
        emails={emails}
        isEmailsLoading={isEmailsLoading}
        onSendEmail={handleSendEmail}
        onSync={handleSync}
        isSyncing={isSyncing}
        lastSyncedAt={lastSyncedAt}
        onEdit={() => selectedCreatorId && handleEdit(selectedCreatorId)}
        onDelete={() => selectedCreatorId && handleDelete(selectedCreatorId)}
        onStatusChange={handleStatusChange}
        onMarkAsRead={handleMarkAsRead}
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
          isOpen={isDeleteDialogOpen}
          setIsOpen={setIsDeleteDialogOpen}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
}
