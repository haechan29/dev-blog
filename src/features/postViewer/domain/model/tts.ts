import { TTSProps } from '@/features/postViewer/ui/ttsProps';

export interface TTS {
  isPlaying: boolean;
  elementIndex: number;
}

export function toProps(tts: TTS): TTSProps {
  return {
    isPlaying: tts.isPlaying,
    elementIndex: tts.elementIndex,
  };
}
