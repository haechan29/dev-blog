export const OUTREACH_EMAIL_TEMPLATES = [
  {
    id: 'first-contact',
    name: '첫 연락',
    subject: (channelName: string) =>
      `${channelName}님 영상을 텍스트로 옮겨서 게재해도 될까요?`,
    body: (
      _channelName: string
    ) => `안녕하세요, 셰어텍스트(sharetext.app)라는 텍스트 콘텐츠 플랫폼을 운영하고 있는 임해찬입니다.

<영상 제목> 영상을 보고 연락드리게 됐어요. 영상 내용을 텍스트로 옮겨서 저희 플랫폼에 게재해도 될지 여쭤보려고요.

원본 영상과 크리에이터님 프로필 링크는 항상 함께 표시되고, 텍스트 기반이라 새로운 유입 경로가 될 수 있어요.

허락해주시면 게재 전에 먼저 공유드릴게요. 수정이나 중단도 언제든 가능하고, 부담되시면 편하게 거절하셔도 괜찮습니다.

감사합니다.
임해찬 드림`,
  },
  {
    id: 'rejection-acknowledgment',
    name: '거절 확인',
    subject: (_channelName: string) => '답변 감사드립니다',
    body: (channelName: string) => `안녕하세요, ${channelName}님!

검토해주셔서 감사합니다. 혹시 나중에 생각이 바뀌시면 편하게 연락 주세요.

감사합니다.
임해찬 드림`,
  },
];
