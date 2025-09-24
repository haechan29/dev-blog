import { TTSProps } from '@/features/post/ui/ttsProps';

export interface TTS {
  isEnabled: boolean;
  isPlaying: boolean;
  elementIndex: number;
}

export function toProps(tts: TTS): TTSProps {
  if (tts.isEnabled)
    return {
      mode: 'enabled',
      isPlaying: tts.isPlaying,
      elementIndex: tts.elementIndex,
    };
  else
    return {
      mode: 'disabled',
    };
}
