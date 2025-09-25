'use client';

import TooltipItem from '@/components/tooltipItem';
import { toProps as toPostViewerProps } from '@/features/postViewer/domain/model/postViewer';
import {
  TTS,
  toProps as toTTSProps,
} from '@/features/postViewer/domain/model/tts';
import useTTSPlayer from '@/features/postViewer/hooks/useTTSPlayer';
import { TTSProps } from '@/features/postViewer/ui/ttsProps';
import { nextPage, setAdvanceMode } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { Headphones, Pause, Play } from 'lucide-react';
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function TTSSection({
  pageRef,
  isViewerMode,
  pageIndex,
}: {
  pageRef: RefObject<HTMLDivElement | null>;
  isViewerMode: boolean;
  pageIndex: number;
}) {
  const [tts, setTTS] = useState<TTS>({
    isEnabled: false,
    isPlaying: false,
    elementIndex: 0,
  });

  const dispatch = useDispatch<AppDispatch>();
  const lastPageIndex = useRef(pageIndex);
  const ttsProps = useMemo(() => toTTSProps(tts), [tts]);

  const toggleIsEnabled = useCallback(() => {
    if (ttsProps.mode === 'enabled') {
      setTTS({
        isEnabled: false,
        isPlaying: false,
        elementIndex: 0,
      });
    } else if (ttsProps.mode === 'disabled') {
      setTTS({
        isEnabled: true,
        isPlaying: true,
        elementIndex: 0,
      });
    }
  }, [ttsProps.mode]);

  const toggleIsPlaying = useCallback(() => {
    if (ttsProps.mode !== 'enabled') return;
    setTTS(prev => ({ ...prev, isPlaying: !ttsProps.isPlaying }));
  }, [ttsProps]);

  const onFinishElement = useCallback(
    (nextElementIndex: number) =>
      setTTS(prev => ({
        ...prev,
        elementIndex: nextElementIndex,
      })),
    []
  );

  const onFinishPage = useCallback(() => dispatch(nextPage()), [dispatch]);

  const { startReading, pauseReading, stopReading } = useTTSPlayer({
    pageRef,
    onFinishElement,
    onFinishPage,
  });

  useEffect(() => {
    if (ttsProps.mode === 'disabled') stopReading();
    else if (ttsProps.mode === 'enabled' && ttsProps.isPlaying)
      startReading(ttsProps.elementIndex);
    else if (ttsProps.mode === 'enabled' && !ttsProps.isPlaying) pauseReading();
  }, [pageRef, pauseReading, startReading, stopReading, ttsProps]);

  useEffect(() => {
    if (!isViewerMode) {
      setTTS({
        isEnabled: false,
        isPlaying: false,
        elementIndex: 0,
      });
    }
  }, [isViewerMode]);

  useEffect(() => {
    if (pageIndex === lastPageIndex.current) return;
    lastPageIndex.current = pageIndex;

    if (ttsProps.mode === 'enabled' && ttsProps.isPlaying) {
      setTTS({
        isEnabled: true,
        isPlaying: true,
        elementIndex: 0,
      });
    }
  }, [pageIndex, ttsProps]);

  return (
    <div className='flex items-center gap-2'>
      <AdvanceModeSync ttsProps={ttsProps} setTTS={setTTS} />
      <TooltipItem text='음성'>
        <button
          onClick={toggleIsEnabled}
          className='relative flex shrink-0 items-center p-2 cursor-pointer'
          aria-label='음성 재생'
        >
          <Headphones
            className={clsx(
              'w-6 h-6',
              ttsProps.mode === 'enabled' ? 'text-gray-900' : 'text-gray-400'
            )}
          />
          <div
            className={clsx(
              'absolute top-2 right-1.5 flex justify-center items-center w-3 h-3 rounded-full',
              ttsProps.mode === 'enabled' && 'bg-white'
            )}
          >
            <div
              className={clsx(
                'w-2 h-2 rounded-full',
                ttsProps.mode === 'enabled' && 'bg-blue-500'
              )}
            />
          </div>
        </button>
      </TooltipItem>

      <div
        className={clsx(
          'flex items-center',
          'transition-opacity duration-300 ease-in-out',
          ttsProps.mode !== 'enabled' && 'opacity-0 pointer-events-none'
        )}
      >
        <button
          onClick={toggleIsPlaying}
          className={clsx(
            'flex items-center cursor-pointer',
            'transition-discrete duration-300 ease-in-out',
            ttsProps.mode === 'enabled' ? 'w-10 p-2' : 'w-0 overflow-hidden'
          )}
          aria-label='음성 일시정지'
        >
          <div className='relative w-6 h-6'>
            <Play
              className={clsx(
                'absolute inset-0 transition-opacity duration-300 button ease-in-out',
                ttsProps.mode === 'enabled' &&
                  ttsProps.isPlaying &&
                  'opacity-0 pointer-events-none'
              )}
            />

            <Pause
              className={clsx(
                'absolute inset-0 transition-opacity duration-300 ease-in-out',
                ttsProps.mode === 'enabled' &&
                  !ttsProps.isPlaying &&
                  'opacity-0 pointer-events-none'
              )}
            />
          </div>
        </button>
      </div>
    </div>
  );
}

function AdvanceModeSync({
  ttsProps,
  setTTS,
}: {
  ttsProps: TTSProps;
  setTTS: (tts: TTS) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const postViewerProps = useMemo(
    () => toPostViewerProps(postViewer),
    [postViewer]
  );
  const advanceMode = useMemo(
    () => postViewerProps.advanceMode,
    [postViewerProps.advanceMode]
  );

  useEffect(() => {
    if (advanceMode !== null && advanceMode !== 'tts') {
      setTTS({
        isEnabled: false,
        isPlaying: false,
        elementIndex: 0,
      });
    }
  }, [advanceMode, setTTS]);

  useEffect(() => {
    if (ttsProps.mode === 'enabled') {
      dispatch(setAdvanceMode('tts'));
    } else if (ttsProps.mode === 'disabled') {
      dispatch(setAdvanceMode(null));
    }
  }, [dispatch, ttsProps.mode]);

  return <></>;
}
