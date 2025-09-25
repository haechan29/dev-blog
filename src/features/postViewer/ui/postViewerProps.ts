export default interface PostViewerProps {
  isButtonVisible: boolean;
  isViewerMode: boolean;
  isControlBarVisible: boolean;
  pageIndex: number;
  totalPages: number;
  advanceMode: 'tts' | 'auto' | null;
}
