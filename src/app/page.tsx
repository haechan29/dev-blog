import Image from 'next/image';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-white'>
      <header className='sticky top-0 z-40 border-b-gray-200 border-b bg-white/80 backdrop-blur'>
        <div className='mx-auto max-w-4xl px-4 py-3 flex gap-20 font-semibold'>
          <div>홈</div>
          <div>포트폴리오</div>
          <div>블로그</div>
        </div>
      </header>

      <div className='mx-auto max-w-4xl px-4 py-10 flex flex-col'>
        <div className='flex'>
          <Image 
            src='/images/programmer-looking.png'
            alt='picture of me'
            width={120}
            height={120}
            className='w-40 mr-20'/>
          <div className='flex flex-1 flex-col justify-center'>
            <div className='text-4xl ml-2 mb-4'>임해찬</div>
            <div className='flex w-full relative mb-2'>
              <div className='absolute w-full h-0.5 top-1/2 -translate-y-1/2 bg-gray-200 rounded-full'/>
              <div className='flex w-full justify-between ml-4 z-10'>
                <div className='w-3 h-3 rounded-full border-gray-300 border-2 bg-white'></div>
                <div className='w-3 h-3 rounded-full border-gray-300 border-2 bg-white'></div>
                <div className='w-3 h-3 rounded-full border-gray-300 border-2 bg-white'></div>
                <div/>
              </div>
            </div>
            <div className='flex ml-4'>
              <div className='flex flex-1 flex-col -ml-1'>
                <div className='text-sm text-gray-500'>2023.04 - 2023.12</div>
                <div className='font-semibold'>소프트웨어 마에스트로</div>
              </div>
              <div className='flex flex-1 flex-col -ml-1'>
                <div className='text-sm text-gray-500'>2024.06 - 2025.07</div>
                <div className='font-semibold'>캐시닥 안드로이드 개발자</div>
              </div>
              <div className='flex flex-1 flex-col -ml-1'>
                <div className='text-sm text-gray-500'>현재</div>
                <div className='font-semibold'>프론트엔드 개발자로서 성장 중</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
