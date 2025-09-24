import TTSProps from '@/features/post/ui/ttsProps';

export type DisabledTTS = {
  mode: 'disabled';
};

export type PlayingTTS = {
  mode: 'playing';
  elementIndex: number;
};

export type PausedTTS = {
  mode: 'paused';
  elementIndex: number;
};

export type ChangePageTTS = {
  mode: 'changingPageTTS';
};

export type TTS = DisabledTTS | PlayingTTS | PausedTTS | ChangePageTTS;

export function toProps(tts: TTS): TTSProps {
  return {
    isEnabled: tts.mode !== 'disabled',
    isPlaying: tts.mode === 'playing',
    isChangingPage: tts.mode === 'changingPageTTS',
    elementIndex:
      tts.mode === 'playing' || tts.mode === 'paused'
        ? tts.elementIndex
        : undefined,
  };
}
