import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { setFullscreenScale } from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useFullscreenScale = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { fullscreenScale } = usePostViewer();

  const [fullscreenScaleLocal, setFullscreenScaleLocal] = useLocalStorage(
    'fullscreen-scale',
    1.5
  );

  useEffect(() => {
    if (fullscreenScale !== fullscreenScaleLocal) return;
    dispatch(setFullscreenScale(fullscreenScaleLocal));
  }, [dispatch, fullscreenScale, fullscreenScaleLocal]);

  useEffect(
    () => setFullscreenScaleLocal(fullscreenScale),
    [fullscreenScale, setFullscreenScaleLocal]
  );
};
