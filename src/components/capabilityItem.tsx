export default function CapabilityItem() {
  return (
    <div className='flex border-1 border-gray-200 rounded-sm mb-30'>
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
  )
}