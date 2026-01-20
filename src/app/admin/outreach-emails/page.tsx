import OutreachEmailForm from '@/components/outreach-emails/outreachEmailForm';
import Tooltip from '@/components/tooltip';
import * as OutreachEmailServerRepository from '@/features/outreach-email/data/repository/outreachEmailServerRepository';

export default async function OutreachEmailsPage() {
  const emails = await OutreachEmailServerRepository.getOutreachEmails();

  return (
    <div className='min-h-screen p-8'>
      <h1 className='text-2xl font-bold mb-6'>이메일 발송 이력</h1>
      <OutreachEmailForm />

      <table className='w-full border-collapse table-fixed'>
        <thead>
          <tr className='border-b'>
            <th className='text-left p-3 w-[20%]'>크리에이터</th>
            <th className='text-left p-3 w-[25%]'>제목</th>
            <th className='text-left p-3 w-[15%]'>상태</th>
            <th className='text-left p-3 w-[15%]'>발송일</th>
            <th className='text-left p-3 w-[15%]'>응답일</th>
          </tr>
        </thead>
        <tbody>
          {emails.map(email => (
            <tr key={email.id} className='border-b'>
              <td className='p-3 truncate'>
                <Tooltip text={email.creatorId}>
                  <span>{email.channelName ?? '-'}</span>
                </Tooltip>
              </td>
              <td className='p-3 truncate'>{email.subject}</td>
              <td className='p-3'>{email.status}</td>
              <td className='p-3 text-sm'>{email.sentAt.slice(0, 10)}</td>
              <td className='p-3 text-sm'>
                {email.respondedAt?.slice(0, 10) ?? '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
