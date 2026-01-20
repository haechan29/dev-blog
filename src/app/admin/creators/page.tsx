import CreatorForm from '@/components/creator/creatorForm';
import * as CreatorServerRepository from '@/features/creator/data/repository/creatorServerRepository';

export default async function CreatorsPage() {
  const creators = await CreatorServerRepository.getCreators();

  return (
    <div className='min-h-screen p-8'>
      <h1 className='text-2xl font-bold mb-6'>크리에이터 관리</h1>
      <CreatorForm />

      <table className='w-full border-collapse table-fixed'>
        <thead>
          <tr className='border-b'>
            <th className='text-left p-3 w-[25%]'>채널명</th>
            <th className='text-left p-3 w-[25%]'>이메일</th>
            <th className='text-left p-3 w-[15%]'>상태</th>
            <th className='text-left p-3 w-[20%]'>메모</th>
            <th className='text-left p-3 w-[15%]'>등록일</th>
          </tr>
        </thead>
        <tbody>
          {creators.map(creator => (
            <tr key={creator.id} className='border-b'>
              <td className='p-3'>{creator.channelName}</td>
              <td className='p-3'>{creator.email}</td>
              <td className='p-3'>{creator.status}</td>
              <td className='p-3 truncate'>{creator.memo ?? '-'}</td>
              <td className='p-3 text-sm'>{creator.createdAt.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
