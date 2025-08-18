import Image from 'next/image';

type IntroductionItemProps = {
  period: string;
  description: string;
}

const introductionItemProps: IntroductionItemProps[] = [
  {
    period: '2023.04 - 2023.12', 
    description: '소프트웨어 마에스트로'
  },
  {
    period: '2024.06 - 2025.07', 
    description: '캐시닥 안드로이드 개발자'
  },
  {
    period: '현재', 
    description: '프론트엔드 개발자로서 성장 중'
  }
]      

export default function IntroductionItem() {
  return (
    <div className='flex flex-col mb-60'>
      <div className='flex justify-center items-center mb-20'>
        <Image 
          src='/images/programmer-looking.png'
          alt='picture of me'
          width={160}
          height={160}
          className='mr-20'/>
        <div className='flex items-end'>
          <div className='text-7xl mr-6'>임해찬</div>
          <div className='text-5xl text-gray-500 font-light'>Im Haechan</div>
        </div>
      </div>
      <div className='w-screen relative left-1/2 mx-[-50vw]'>
        <div className='flex'>
          <div className='flex flex-2 h-2 bg-gray-300 mt-3' />
          {introductionItemProps.map((item) => (
            <div key={item.description} className='basis-[380px] max-w-[380px] flex-col'>
              <div className='flex items-center mb-4'>
                <div className='w-4 h-2 bg-gray-300' />
                <div className='w-8 h-8 border-4 border-gray-300 rounded-full' />
                <div className='flex flex-1 h-2 bg-gray-300' />
              </div>
              <div className='text-lg text-gray-500 ml-4 mb-1'>{item.period}</div>
              <div className='text-2xl font-semibold ml-4'>{item.description}</div>
            </div>
          ))}
          <div className='flex flex-1 h-2 bg-gray-300 mt-3' />
        </div>
      </div>
    </div>
  )
}