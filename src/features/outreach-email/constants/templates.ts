export const OUTREACH_EMAIL_TEMPLATES = [
  {
    id: 'first-contact',
    name: '첫 연락',
    subject: '[셰어텍스트] 영상 콘텐츠 텍스트 게재 제안드립니다',
    body: (
      channelName: string
    ) => `안녕하세요, 셰어텍스트라는 텍스트 콘텐츠 플랫폼을 운영하고 있는 임해찬입니다. (https://sharetext.app)

${channelName}님의 <영상 제목> 영상을 보고 연락드리게 됐어요. 영상 내용이 텍스트로 읽어도 충분히 가치 있겠다 싶어서, 저희 플랫폼에 소개해도 될지 여쭤보려고요.

원본 영상과 크리에이터님 프로필 링크도 함께 표시됩니다. 아직 초기라 유저가 많진 않지만, 텍스트 기반이라 검색 유입이 생길 수 있어요.

허락해주시면 제가 텍스트로 정리해서 게재 전에 먼저 공유드릴게요. 수정 요청이나 게재 중단도 언제든 가능합니다. 부담되시면 편하게 거절하셔도 괜찮아요.

감사합니다.
임해찬 드림`,
  },
  {
    id: 'rejection-acknowledgment',
    name: '거절 확인',
    subject: '[셰어텍스트] 답변 감사드립니다',
    body: (channelName: string) => `안녕하세요, ${channelName}님!

검토해주셔서 감사합니다. 혹시 나중에 생각이 바뀌시면 편하게 연락 주세요.

감사합니다.
임해찬 드림`,
  },
];
