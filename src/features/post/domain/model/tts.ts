import TTSProps from '@/features/post/ui/ttsProps';

export type DisabledTTS = {
  mode: 'disabled';
};

export type PlayingTTS = {
  mode: 'playing';
  pageIndex: number;
  elementIndex: number;
};

export type PausedTTS = {
  mode: 'paused';
  pageIndex: number;
  elementIndex: number;
};

export type TTS = DisabledTTS | PlayingTTS | PausedTTS;

export function toProps(tts: TTS): TTSProps {
  return {
    isEnabled: tts.mode !== 'disabled',
    isPlaying: tts.mode === 'playing',
    pageIndex: tts.mode !== 'disabled' ? tts.pageIndex : undefined,
    elementIndex: tts.mode !== 'disabled' ? tts.elementIndex : undefined,
  };
}
