export function getKoreanVoice() {
  const voices = speechSynthesis.getVoices();
  return voices.find(
    voice =>
      voice.lang === 'ko-KR' &&
      (voice.name.includes('Google') || voice.name.includes('Microsoft'))
  );
}
