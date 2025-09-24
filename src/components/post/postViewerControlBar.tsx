'use client';

import TooltipItem from '@/components/tooltipItem';
import { AutoAdvance, toProps } from '@/features/post/domain/model/autoAdvance';
import { toProps as toPostViewerProps } from '@/features/post/domain/model/postViewer';
import { TTS, toProps as toTTSProps } from '@/features/post/domain/model/tts';
import useIsMobile from '@/hooks/useIsMobile';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { nextPage, setIsViewerMode } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { getUtterance } from '@/lib/tts';
import clsx from 'clsx';
import { Headphones, Minimize, Timer } from 'lucide-react';
import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PostViewerControlBar({
  pageRef,
}: {
  pageRef: RefObject<HTMLDivElement | null>;
}) {
  const [tts, setTTS] = useState<TTS>({
    mode: 'disabled',
  });
  const [autoAdvance, setAutoAdvance] = useLocalStorage<AutoAdvance>(
    'auto-advance-settings',
    {
      type: 'NotEnabled',
    }
  );

  const dispatch = useDispatch<AppDispatch>();
  const { isViewerMode, isControlBarVisible, pageIndex, totalPages } =
    useSelector((state: RootState) => toPostViewerProps(state.postViewer));
  const isMobile = useIsMobile();

  const ttsProps = useMemo(() => toTTSProps(tts), [tts]);

  const { isAutoAdvanceEnabled, autoAdvanceInterval } = useMemo(
    () => toProps(autoAdvance),
    [autoAdvance]
  );

  const progress = useMemo(() => {
    return (pageIndex / (totalPages - 1)) * 100;
  }, [pageIndex, totalPages]);

  const handleAutoAdvanceClick = useCallback(() => {
    const intervals = [60, 90, 120];
    const currentIndex =
      autoAdvanceInterval !== undefined
        ? intervals.indexOf(autoAdvanceInterval)
        : -1;

    if (currentIndex === intervals.length - 1) {
      setAutoAdvance({
        type: 'NotEnabled',
      });
    } else {
      setAutoAdvance({
        type: 'Enabled',
        interval: intervals[currentIndex + 1],
      });
    }
  }, [autoAdvanceInterval, setAutoAdvance]);

  const startReading = useCallback(
    (elementIndex: number) => {
      const page = pageRef.current;
      if (!page) return;

      const currentPageElements = page.children;
      if (elementIndex >= currentPageElements.length) {
        if (pageIndex < totalPages - 1) {
          setTTS({
            mode: 'changingPageTTS',
          });
        }
        return;
      }

      const element = currentPageElements[elementIndex];

      document
        .querySelectorAll('.reading-highlight')
        .forEach(el => el.classList.remove('reading-highlight'));

      element.classList.add('reading-highlight');

      const utterance = getUtterance(element.textContent);
      utterance.onend = () => {
        setTTS({
          mode: 'playing',
          elementIndex: elementIndex + 1,
        });
      };

      speechSynthesis.speak(utterance);
    },
    [pageIndex, pageRef, totalPages]
  );

  const pauseReading = useCallback(() => {
    speechSynthesis.resume();
  }, []);

  const stopReading = useCallback(() => {
    speechSynthesis.cancel();

    document
      .querySelectorAll('.reading-highlight')
      .forEach(el => el.classList.remove('reading-highlight'));
  }, []);

  const toggleTTS = useCallback(() => {
    if (ttsProps.isEnabled) {
      setTTS({ mode: 'disabled' });
    } else {
      setTTS({ mode: 'playing', elementIndex: 0 });
    }
  }, [ttsProps.isEnabled]);

  const togglePlayback = useCallback(() => {
    if (tts.mode === 'playing') {
      setTTS({ ...tts, mode: 'paused' });
    } else if (tts.mode === 'paused') {
      setTTS({ ...tts, mode: 'playing' });
    }
  }, [tts]);

  useEffect(() => {
    if (!isAutoAdvanceEnabled || !autoAdvanceInterval) return;
    if (pageIndex >= totalPages - 1) return;

    const timer = setTimeout(() => {
      dispatch(nextPage());
    }, autoAdvanceInterval * 1000);

    return () => clearTimeout(timer);
  }, [
    dispatch,
    isAutoAdvanceEnabled,
    autoAdvanceInterval,
    pageIndex,
    totalPages,
  ]);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    if (!ttsProps.isEnabled) {
      stopReading();
    } else if (ttsProps.isChangingPage) {
      dispatch(nextPage());
    } else if (ttsProps.isPlaying) {
      startReading(ttsProps.elementIndex!);
    } else {
      pauseReading();
    }
  }, [ttsProps, pageRef, startReading, pauseReading, stopReading, dispatch]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (ttsProps.isChangingPage) {
      timer = setTimeout(() =>
        setTTS({
          mode: 'playing',
          elementIndex: 0,
        })
      );
    }
    return () => clearTimeout(timer);
  }, [pageIndex, ttsProps.isChangingPage]);

  useEffect(() => {
    if (!isViewerMode) {
      setTTS({ mode: 'disabled' });
    }
  }, [isViewerMode, stopReading]);

  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 flex flex-col bg-white/80 backdrop-blur-md',
        'transition-transform|opacity duration-300 ease-in-out',
        !isControlBarVisible && 'translate-y-full opacity-0'
      )}
    >
      <div className='px-10'>
        <div className='relative w-full h-0.5 bg-gray-200'>
          <div
            className='relative h-0.5 bg-blue-500'
            style={{ width: `${progress}%` }}
          >
            <div className='absolute w-3 h-3 -top-1 -right-1.5 bg-blue-500 rounded-full' />
          </div>
        </div>
      </div>

      <div className='flex w-full py-3 px-10 justify-between items-center'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center text-sm whitespace-nowrap mr-4'>
            <span>{pageIndex + 1}</span>
            <span className='mx-1'>/</span>
            <span>{totalPages}</span>
          </div>

          <TooltipItem text='음성'>
            <button
              onClick={toggleTTS}
              className='relative flex shrink-0 items-center p-2 cursor-pointer'
              aria-label={ttsProps.isEnabled ? '음성 중지' : '음성 재생'}
            >
              <Headphones
                className={clsx(
                  'w-6 h-6',
                  ttsProps.isEnabled ? 'text-gray-900' : 'text-gray-400'
                )}
              />
              <div
                className={clsx(
                  'absolute top-2 right-1.5 flex justify-center items-center w-3 h-3 rounded-full',
                  ttsProps.isEnabled && 'bg-white'
                )}
              >
                <div
                  className={clsx(
                    'w-2 h-2 rounded-full',
                    ttsProps.isEnabled && 'bg-blue-500'
                  )}
                />
              </div>
            </button>
          </TooltipItem>

          <div className='flex items-center gap-2'>{isMobile && <></>}</div>

          <div
            className={clsx(
              'transition-opacity duration-300 ease-in-out',
              ttsProps.isEnabled && 'opacity-0 pointer-none'
            )}
          >
            <TooltipItem text='자동 넘김'>
              <button
                onClick={handleAutoAdvanceClick}
                className='relative flex shrink-0 items-center p-2 cursor-pointer'
                aria-label={
                  isAutoAdvanceEnabled ? '자동 넘김 중지' : '자동 넘김 시작'
                }
              >
                <Timer
                  className={clsx(
                    'w-6 h-6',
                    isAutoAdvanceEnabled ? 'text-gray-900' : 'text-gray-400'
                  )}
                />
                {isAutoAdvanceEnabled && (
                  <div className='absolute top-[22px] left-[22px] flex justify-center items-center bg-white'>
                    <div className='text-xs font-bold text-blue-600'>
                      {autoAdvanceInterval}
                    </div>
                  </div>
                )}
              </button>
            </TooltipItem>
          </div>
        </div>

        <TooltipItem text='전체화면 해제'>
          <button
            onClick={() => dispatch(setIsViewerMode(false))}
            className='flex shrink-0 p-2 cursor-pointer'
            aria-label='전체화면 끄기'
          >
            <Minimize className='w-6 h-6 hover:animate-pop hover:[--scale:0.8]' />
          </button>
        </TooltipItem>
      </div>
    </div>
  );
}
