import clsx from 'clsx';

type CapabilityItemProps = {
  titles: string[];
  description: string;
  backgroundStyle: string;
};

const capabilityItemProps: CapabilityItemProps[] = [
  {
    titles: ['실무 경험을 가진', '안드로이드 개발자'],
    description:
      '구글이 권장하는 앱 아키텍처와 Jetpack 라이브러리를 활용합니다. Coroutines을 사용하여 반응형 프로그래밍을 구현합니다.',
    backgroundStyle: 'border border-gray-100',
  },
  {
    titles: ['빠르고 안정적으로', '개발하는 엔지니어'],
    description:
      'UI 테스트, 유닛 테스트 작성 경험이 있습니다. 자동 배포 환경을 구성하여 효율적으로 작업합니다.',
    backgroundStyle: 'bg-gray-50',
  },
  {
    titles: ['잠재력 높은', '프런트엔드 개발자'],
    description:
      '다양한 프런트엔드 플랫폼에 열정이 있습니다. React와 Next.js를 활용한 사이드 프로젝트 경험이 있습니다.',
    backgroundStyle: 'bg-blue-50',
  },
];

export default function CapabilityItem({ className }: { className?: string }) {
  return (
    <div className={clsx('flex min-h-72 gap-4', className)}>
      {capabilityItemProps.map(item => (
        <div
          key={item.description}
          className={`flex flex-1 flex-col p-10 ${item.backgroundStyle}`}
        >
          <div className='text-2xl font-bold mb-10'>
            {item.titles.map(title => (
              <div key={title}>{title}</div>
            ))}
          </div>
          <div className='break-keep'>{item.description}</div>
        </div>
      ))}
    </div>
  );
}
