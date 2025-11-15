export interface BgmController {
  videoId: string | null;
  start: number | null;
  isPlaying: boolean;
  isError: boolean;
  isWaiting: boolean;
  isReady: boolean;
}
