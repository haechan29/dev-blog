export default interface PostViewerProps {
  isButtonVisible: boolean;
  isViewerMode: boolean;
  isControlBarVisible: boolean;
  pageNumber: number | null;
  totalPages: number | null;
  advanceMode: 'tts' | 'auto' | null;
}
