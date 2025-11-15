export interface BgmController {
  isPlaying: boolean;
  isError: boolean;
  isWaiting: boolean;
  isReady: boolean;
  action:
    | {
        type: 'togglePlay';
        payload: {
          videoId: string | null;
          start: number | null;
        };
      }
    | {
        type: 'showVideo';
      }
    | null;
}
