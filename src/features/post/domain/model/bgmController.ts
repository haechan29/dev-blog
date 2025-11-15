import { Position } from '@/types/position';

export interface BgmController {
  isPlaying: boolean;
  isError: boolean;
  /**
   * not ready and will play when ready
   */
  isWaiting: boolean;
  isReady: boolean;
  isVideoVisible: boolean;
  currentVideoId: string | null;
  position: Position | null;
  requestedBgm: {
    videoId: string | null;
    start: number | null;
  };
}
