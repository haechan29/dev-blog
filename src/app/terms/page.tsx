export default function TermsPage() {
  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <h1 className='text-3xl font-bold mb-2'>서비스 이용약관</h1>
      <p className='text-sm text-gray-600 mb-8'>시행일: 2025년 1월 1일</p>

      <div className='prose prose-gray max-w-none'>
        <h2 className='text-xl font-bold mt-8 mb-4'>제1조 (목적)</h2>
        <p className='mb-4'>
          본 약관은 본 서비스가 제공하는 온라인 콘텐츠 공유 플랫폼 서비스의
          이용과 관련하여 서비스와 이용자 간의 권리, 의무 및 책임사항을 규정함을
          목적으로 합니다.
        </p>

        <h2 className='text-xl font-bold mt-8 mb-4'>제2조 (정의)</h2>
        <ol className='list-decimal list-inside mb-4 space-y-2'>
          <li>
            &quot;서비스&quot;란 이용자가 텍스트 기반 콘텐츠를 작성, 공유,
            열람할 수 있는 플랫폼을 말합니다.
          </li>
          <li>
            &quot;이용자&quot;란 본 약관에 동의하고 서비스를 이용하는 자를
            말합니다.
          </li>
          <li>
            &quot;게시물&quot;이란 이용자가 서비스에 게시한 텍스트, 이미지 등
            모든 콘텐츠를 말합니다.
          </li>
        </ol>

        <h2 className='text-xl font-bold mt-8 mb-4'>
          제3조 (약관의 효력 및 변경)
        </h2>
        <ol className='list-decimal list-inside mb-4 space-y-2'>
          <li>
            본 약관은 서비스 화면에 게시하여 공지함으로써 효력이 발생합니다.
          </li>
          <li>
            서비스는 필요한 경우 본 약관을 변경할 수 있으며, 변경된 약관은 공지
            후 7일 뒤부터 효력이 발생합니다.
          </li>
          <li>
            이용자가 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고
            탈퇴할 수 있습니다.
          </li>
        </ol>

        <h2 className='text-xl font-bold mt-8 mb-4'>제4조 (회원가입)</h2>
        <ol className='list-decimal list-inside mb-4 space-y-2'>
          <li>이용자는 소셜 로그인을 통해 회원가입을 신청합니다.</li>
          <li>
            회원가입 시 닉네임을 설정하며, 본 약관 및 개인정보 처리방침에
            동의해야 합니다.
          </li>
          <li>
            다음 각 호에 해당하는 경우 가입을 거부하거나 승인을 취소할 수
            있습니다:
            <ul className='list-disc list-inside ml-6 mt-2 space-y-1'>
              <li>타인의 정보를 도용한 경우</li>
              <li>만 14세 미만인 경우</li>
              <li>과거 약관 위반으로 제재를 받은 이력이 있는 경우</li>
            </ul>
          </li>
        </ol>

        <h2 className='text-xl font-bold mt-8 mb-4'>
          제5조 (회원 탈퇴 및 자격 상실)
        </h2>
        <ol className='list-decimal list-inside mb-4 space-y-2'>
          <li>
            이용자는 언제든지 탈퇴를 요청할 수 있으며, 서비스는 즉시 처리합니다.
          </li>
          <li>
            탈퇴 시 작성한 게시물은 삭제되지 않으며, 삭제를 원할 경우 탈퇴 전에
            직접 삭제해야 합니다.
          </li>
          <li>
            다음 각 호에 해당하는 경우 서비스는 회원 자격을 제한하거나 정지시킬
            수 있습니다:
            <ul className='list-disc list-inside ml-6 mt-2 space-y-1'>
              <li>타인의 권리를 침해한 경우</li>
              <li>서비스 운영을 방해한 경우</li>
              <li>본 약관을 위반한 경우</li>
            </ul>
          </li>
        </ol>

        <h2 className='text-xl font-bold mt-8 mb-4'>제6조 (게시물의 관리)</h2>
        <ol className='list-decimal list-inside mb-4 space-y-2'>
          <li>게시물의 저작권은 작성자에게 있습니다.</li>
          <li>
            이용자는 게시물을 통해 다음 행위를 해서는 안 됩니다:
            <ul className='list-disc list-inside ml-6 mt-2 space-y-1'>
              <li>타인의 명예를 훼손하거나 모욕하는 행위</li>
              <li>타인의 저작권 등 지적재산권을 침해하는 행위</li>
              <li>음란물, 폭력적 콘텐츠 게시</li>
              <li>스팸, 광고성 게시물 무단 게시</li>
              <li>허위 정보 유포</li>
            </ul>
          </li>
          <li>
            서비스는 위반 게시물을 사전 통보 없이 삭제하거나 제한할 수 있습니다.
          </li>
          <li>
            이용자는 서비스에 게시물을 게시함으로써 서비스가 해당 게시물을
            서비스 내에서 복제, 전송, 전시할 수 있도록 비독점적 권리를
            부여합니다.
          </li>
        </ol>

        <h2 className='text-xl font-bold mt-8 mb-4'>
          제7조 (서비스의 제공 및 변경)
        </h2>
        <ol className='list-decimal list-inside mb-4 space-y-2'>
          <li>서비스는 연중무휴 1일 24시간 제공함을 원칙으로 합니다.</li>
          <li>
            서비스는 시스템 점검, 장애 등의 사유로 서비스를 일시 중단할 수
            있습니다.
          </li>
          <li>
            서비스는 필요한 경우 서비스의 내용을 변경하거나 종료할 수 있으며, 이
            경우 30일 전에 공지합니다.
          </li>
        </ol>

        <h2 className='text-xl font-bold mt-8 mb-4'>제8조 (면책조항)</h2>
        <ol className='list-decimal list-inside mb-4 space-y-2'>
          <li>
            서비스는 천재지변, 불가항력 등으로 서비스를 제공할 수 없는 경우
            책임이 면제됩니다.
          </li>
          <li>
            서비스는 이용자 간 또는 이용자와 제3자 간에 발생한 분쟁에 대해
            책임지지 않습니다.
          </li>
          <li>
            서비스는 이용자가 게시한 정보의 신뢰도, 정확성에 대해 책임지지
            않습니다.
          </li>
          <li>서비스는 무료로 제공되며, 이에 따른 손해배상 책임은 없습니다.</li>
        </ol>

        <h2 className='text-xl font-bold mt-8 mb-4'>제9조 (분쟁 해결)</h2>
        <ol className='list-decimal list-inside mb-4 space-y-2'>
          <li>
            서비스와 이용자 간 발생한 분쟁은 대한민국 법률에 따라 해결합니다.
          </li>
          <li>
            소송이 필요한 경우 서비스 소재지 관할 법원을 전속 관할로 합니다.
          </li>
        </ol>

        <h2 className='text-xl font-bold mt-8 mb-4'>제10조 (기타)</h2>
        <p className='mb-4'>
          본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.
        </p>
      </div>
    </div>
  );
}
