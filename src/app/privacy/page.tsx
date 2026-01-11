export default function PrivacyPage() {
  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <h1 className='text-3xl font-bold mb-2'>개인정보 처리방침</h1>
      <p className='text-sm text-gray-600 mb-8'>시행일: 2026년 1월 1일</p>

      <div className='prose prose-gray max-w-none'>
        <p className='mb-8'>
          본 서비스는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」을
          준수하고 있습니다.
        </p>

        <h2 className='text-xl font-bold mt-8 mb-4'>1. 수집하는 개인정보</h2>
        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-2'>필수 정보</h3>
          <ul className='list-disc list-inside mb-4 space-y-1'>
            <li>닉네임</li>
            <li>이메일</li>
          </ul>

          <h3 className='text-lg font-semibold mb-2'>자동 수집 정보</h3>
          <ul className='list-disc list-inside mb-4 space-y-1'>
            <li>서비스 이용 기록</li>
          </ul>
        </div>

        <h2 className='text-xl font-bold mt-8 mb-4'>
          2. 개인정보 수집 및 이용 목적
        </h2>
        <ul className='list-disc list-inside mb-4 space-y-1'>
          <li>회원 가입 및 식별</li>
          <li>서비스 제공 및 게시물 관리</li>
          <li>부정 이용 방지</li>
          <li>문의 및 민원 처리</li>
        </ul>

        <h2 className='text-xl font-bold mt-8 mb-4'>
          3. 개인정보 보유 및 이용 기간
        </h2>
        <ul className='list-disc list-inside mb-4 space-y-2'>
          <li>회원 탈퇴 시까지 보유</li>
          <li>탈퇴 후 즉시 파기</li>
        </ul>

        <h2 className='text-xl font-bold mt-8 mb-4'>4. 개인정보 제3자 제공</h2>
        <p className='mb-4'>
          서비스는 이용자의 개인정보를 외부에 제공하지 않습니다. 단, 법령에 의한
          요구가 있는 경우는 예외로 합니다.
        </p>

        <h2 className='text-xl font-bold mt-8 mb-4'>5. 개인정보 처리 위탁</h2>
        <p className='mb-4'>
          서비스는 안정적인 서비스 제공을 위해 다음과 같이 개인정보 처리를
          위탁합니다:
        </p>
        <div className='mb-4 overflow-x-auto'>
          <table className='min-w-full border border-gray-300'>
            <thead>
              <tr className='bg-gray-50'>
                <th className='border border-gray-300 px-4 py-2 text-left'>
                  수탁업체
                </th>
                <th className='border border-gray-300 px-4 py-2 text-left'>
                  위탁 업무 내용
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='border border-gray-300 px-4 py-2'>Supabase</td>
                <td className='border border-gray-300 px-4 py-2'>
                  데이터베이스 관리
                </td>
              </tr>
              <tr>
                <td className='border border-gray-300 px-4 py-2'>Google</td>
                <td className='border border-gray-300 px-4 py-2'>
                  소셜 로그인 인증
                </td>
              </tr>
              <tr>
                <td className='border border-gray-300 px-4 py-2'>카카오</td>
                <td className='border border-gray-300 px-4 py-2'>
                  소셜 로그인 인증
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className='text-xl font-bold mt-8 mb-4'>6. 광고 및 쿠키</h2>
        <p className='mb-4'>
          본 서비스는 Google AdSense를 통해 광고를 게재하며, 이 과정에서 쿠키가
          사용됩니다.
        </p>
        <ul className='list-disc list-inside mb-4 space-y-2'>
          <li>
            Google을 포함한 제3자 광고 업체는 쿠키를 사용하여 이용자의 이전
            웹사이트 방문 기록을 기반으로 광고를 게재할 수 있습니다.
          </li>
          <li>
            Google의 광고 쿠키 사용으로 인해 이용자가 본 서비스 및 타 웹사이트를
            방문한 기록을 바탕으로 맞춤 광고가 표시될 수 있습니다.
          </li>
          <li>
            이용자는{' '}
            <a
              href='https://www.google.com/settings/ads'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              Google 광고 설정
            </a>
            에서 맞춤 광고를 거부할 수 있습니다.
          </li>
          <li>
            또한{' '}
            <a
              href='https://www.aboutads.info/choices/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              www.aboutads.info
            </a>
            에서 제3자 광고 업체의 쿠키 사용을 거부할 수 있습니다.
          </li>
        </ul>

        <h2 className='text-xl font-bold mt-8 mb-4'>7. 이용자의 권리</h2>
        <p className='mb-4'>이용자는 언제든지:</p>
        <ul className='list-disc list-inside mb-4 space-y-1'>
          <li>개인정보 열람 및 수정</li>
          <li>회원 탈퇴 (개인정보 삭제)</li>
        </ul>
        <p className='mb-4'>
          위 권리는 서비스 내 설정 메뉴에서 직접 행사할 수 있습니다.
        </p>

        <h2 className='text-xl font-bold mt-8 mb-4'>8. 개인정보 파기</h2>
        <ul className='list-disc list-inside mb-4 space-y-1'>
          <li>회원 탈퇴 시 지체 없이 파기</li>
          <li>전자적 파일은 복구 불가능한 방법으로 삭제</li>
        </ul>

        <h2 className='text-xl font-bold mt-8 mb-4'>9. 개인정보 보호책임자</h2>
        <ul className='list-none mb-4 space-y-1'>
          <li>이름: 임해찬</li>
          <li>이메일: haechan.im@gmail.com</li>
        </ul>
        <p className='mb-4 font-semibold'>개인정보 침해 신고:</p>
        <ul className='list-disc list-inside mb-4 space-y-1'>
          <li>개인정보침해신고센터: 118 (privacy.kisa.or.kr)</li>
          <li>개인정보분쟁조정위원회: 1833-6972</li>
        </ul>

        <h2 className='text-xl font-bold mt-8 mb-4'>
          10. 개인정보 안전성 확보
        </h2>
        <ul className='list-disc list-inside mb-4 space-y-1'>
          <li>데이터베이스 접근 권한 제한</li>
          <li>HTTPS 암호화 통신</li>
          <li>정기적인 보안 업데이트</li>
        </ul>

        <h2 className='text-xl font-bold mt-8 mb-4'>
          11. 개인정보 처리방침 변경
        </h2>
        <p className='mb-4'>
          이 처리방침이 변경되는 경우 서비스 공지사항을 통해 최소 7일 전
          고지합니다.
        </p>
      </div>
    </div>
  );
}
