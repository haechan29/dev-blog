export interface BgmController {
  isPlaying: boolean;
  isError: boolean;
  /**
   * not ready and will play when ready
   */
  isWaiting: boolean;
  isReady: boolean;
  currentContainerId: string | null;
  requestedBgm: {
    src: string | null;
    containerId: string | null;
  };
}
