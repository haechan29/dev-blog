import { auth } from '@/auth';
import * as InquiryServerRepository from '@/features/inquiry/data/repository/inquiryServerRepository';
import { notFound } from 'next/navigation';

export default async function AdminPage() {
  const session = await auth();
  const isAdmin = session?.user?.user_id === process.env.ADMIN_USER_ID;

  if (!isAdmin) {
    notFound();
  }

  const inquiries = await InquiryServerRepository.getInquiries();

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-6'>어드민</h1>
      <h2 className='text-xl font-semibold mb-4'>문의 목록</h2>
      <table className='w-full border-collapse'>
        <thead>
          <tr className='border-b'>
            <th className='text-left p-3'>유저 ID</th>
            <th className='text-left p-3'>닉네임</th>
            <th className='text-left p-3'>내용</th>
            <th className='text-left p-3'>날짜</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map(inquiry => (
            <tr key={inquiry.id} className='border-b'>
              <td className='p-3 font-mono text-sm'>
                {inquiry.userId.slice(0, 8)}
              </td>
              <td className='p-3'>{inquiry.nickname ?? '-'}</td>
              <td className='p-3'>{inquiry.content}</td>
              <td className='p-3 text-sm'>{inquiry.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
