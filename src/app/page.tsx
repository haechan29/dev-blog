import CapabilityItem from '@/components/aboutMe/capabilityItem';
import FooterItem from '@/components/aboutMe/footerItem';
import IntroductionItem from '@/components/aboutMe/introductionItem';
import ProjectsItem from '@/components/aboutMe/projectsItem';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-white'>
      <div className='mx-auto max-w-6xl px-4 flex flex-col'>
        <IntroductionItem className='mb-20' />
        <CapabilityItem className='mb-50' />
        <ProjectsItem className='mb-40' />
      </div>
      <FooterItem />
    </div>
  );
}
