export function getUtterance(content: string) {
  const utterance = new SpeechSynthesisUtterance(content);
  utterance.lang = 'ko-KR';
  const krVoice = getKoreanVoice();
  if (krVoice) {
    utterance.voice = krVoice;
  }
  return utterance;
}

export function getKoreanVoice() {
  const voices = speechSynthesis.getVoices();
  return voices.find(
    voice =>
      voice.lang === 'ko-KR' &&
      (voice.name.includes('Google') || voice.name.includes('Microsoft'))
  );
}

export function isReadable(element: Element) {
  const hasText = element.textContent.trim().length > 0;
  const isPaged = element.classList.contains('paged');
  return hasText && !isPaged;
}
