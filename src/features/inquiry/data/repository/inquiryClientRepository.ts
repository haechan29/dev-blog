import { api } from '@/lib/api';

export async function createInquiry(content: string): Promise<void> {
  await api.post('/api/inquiries', { content });
}
