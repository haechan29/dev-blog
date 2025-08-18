import CapabilityItem from '@/components/capabilityItem';
import FooterItem from '@/components/footerItem';
import IntroductionItem from '@/components/introductionItem';
import ProjectsItem from '@/components/projectsItem';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-white'>
      {/* <header className='sticky top-0 z-40 border-b-gray-200 border-b bg-white/80 backdrop-blur'>
        <div className='mx-auto max-w-6xl px-4 py-3 flex gap-20 font-semibold'>
          <div>홈</div>
          <div>포트폴리오</div>
          <div>블로그</div>
        </div>
      </header> */}

      <div className='mx-auto max-w-6xl px-4 flex flex-col'>
        <IntroductionItem className='mb-20' />
        <CapabilityItem className='mb-50'/>
        <ProjectsItem className='mb-40' />
      </div>
      <FooterItem />
    </div>
  );
}
