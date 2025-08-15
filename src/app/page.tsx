import ProjectItem from '@/components/projectItem';
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
        <div className='flex mb-20'>
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
              <div className='flex flex-1 flex-col -ml-1 pr-2'>
                <div className='text-sm text-gray-500'>2023.04 - 2023.12</div>
                <div className='font-semibold'>소프트웨어 마에스트로</div>
              </div>
              <div className='flex flex-1 flex-col -ml-1 pr-2'>
                <div className='text-sm text-gray-500'>2024.06 - 2025.07</div>
                <div className='font-semibold'>캐시닥 안드로이드 개발자</div>
              </div>
              <div className='flex flex-1 flex-col -ml-1 pr-2'>
                <div className='text-sm text-gray-500'>현재</div>
                <div className='font-semibold'>프론트엔드 개발자로서 성장 중</div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex border-1 border-gray-200 rounded-sm mb-20'>
          <div className='flex flex-1 flex-col border-r border-gray-200 px-10 py-6'>
            <div className='text-xl font-semibold mb-4'>
              <div>실무 경력을 가진</div>
              <div>안드로이드 개발자</div>
            </div>
            <div>
              구글이 권장하는 앱 아키텍처와 Jetpack 라이브러리를 활용합니다.
              Coroutines을 사용하여 반응형 프로그래밍을 구현합니다.
            </div>
          </div>
          <div className='flex flex-1 flex-col border-r border-gray-200 px-10 py-6'>
            <div className='text-xl font-semibold mb-4'>
              <div>빠르고 안정적으로</div>
              <div>개발하는 엔지니어</div>
            </div>
            <div>
              UI 테스트, 유닛 테스트 작성 경험이 있습니다.
              자동 배포 환경을 구성하여 효율적으로 작업합니다.
            </div>
          </div>
          <div className='flex flex-1 flex-col px-10 py-6'>
            <div className='text-xl font-semibold mb-4'>
              <div>잠재력 높은</div>
              <div>프런트엔드 개발자</div>
            </div>
            <div>
              다양한 프런트엔드 플랫폼에 열정이 있습니다.
              React와 Next.js를 활용한 사이드 프로젝트 경험이 있습니다.
            </div>
          </div>
        </div>

        <ProjectItem />
      </div>
    </div>
  );
}
