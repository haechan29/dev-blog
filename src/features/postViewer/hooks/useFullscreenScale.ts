import { toProps } from '@/features/postViewer/domain/model/postViewer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { setFullscreenScale } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useFullscreenScale = () => {
  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { fullscreenScale } = useMemo(() => toProps(postViewer), [postViewer]);

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
