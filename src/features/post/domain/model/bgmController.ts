export interface BgmController {
  isPlaying: boolean;
  isError: boolean;
  /**
   * not ready and will play when ready
   */
  isWaiting: boolean;
  isReady: boolean;
  isMenuVisible: boolean;
  isVideoVisible: boolean;
  currentVideoId: string | null;
  currentContainerId: string | null;
  requestedBgm: {
    videoId: string | null;
    start: number | null;
    containerId: string | null;
  };
}
