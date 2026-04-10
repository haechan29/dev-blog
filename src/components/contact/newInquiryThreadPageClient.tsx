'use client';

import InquiryThreadContainer from '@/components/contact/inquiryThreadContainer';
import { useState } from 'react';

export default function NewInquiryThreadPageClient() {
  const [draft, setDraft] = useState('');

  const createInquiry = async () => {};

  return (
    <InquiryThreadContainer
      draft={draft}
      messages={[]}
      onDraftChange={setDraft}
      onSend={createInquiry}
      autoFocus
    />
  );
}
