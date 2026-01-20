import Tooltip from '@/components/tooltip';
import * as InquiryServerRepository from '@/features/inquiry/data/repository/inquiryServerRepository';

export default async function AdminPage() {
  const inquiries = await InquiryServerRepository.getInquiries();

  return (
    <div className='min-h-screen p-8'>
      <h1 className='text-2xl font-bold mb-6'>어드민</h1>
      <h2 className='text-xl font-semibold mb-4'>문의 목록</h2>
      <table className='w-full border-collapse table-fixed'>
        <thead>
          <tr className='border-b'>
            <th className='text-left p-3 w-[15%]'>유저 ID</th>
            <th className='text-left p-3 w-[15%]'>닉네임</th>
            <th className='text-left p-3 w-[50%]'>내용</th>
            <th className='text-left p-3 w-[20%]'>날짜</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map(inquiry => (
            <tr key={inquiry.id} className='border-b'>
              <td className='p-3 font-mono text-sm truncate'>
                <Tooltip text={inquiry.userId}>
                  <span>{inquiry.userId.slice(0, 8)}</span>
                </Tooltip>
              </td>
              <td className='p-3 truncate'>{inquiry.nickname ?? '-'}</td>
              <td className='p-3'>{inquiry.content}</td>
              <td className='p-3 text-sm'>
                <Tooltip text={inquiry.createdAt}>
                  <span>{inquiry.createdAtBrief}</span>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
