import {
  nextPage,
  previousPage,
  setCurrentPageIndex,
} from '@/lib/redux/post/postPositionSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { MiddlewareParams } from '@/types/middlewareParams';
import { isAnyOf, Middleware } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

export const postPositionMiddleware: Middleware<
  unknown,
  RootState,
  AppDispatch
> = store => next => action => {
  if (isAnyOf(setCurrentPageIndex)(action)) {
    return handleSetCurrentPageIndex({ store, next, action });
  }

  if (isAnyOf(nextPage)(action)) {
    return handleNextPage({ store, next, action });
  }

  if (isAnyOf(previousPage)(action)) {
    return handlePreviousPage({ store, next, action });
  }

  return next(action);
};

function handleSetCurrentPageIndex({
  store,
  next,
  action,
}: MiddlewareParams<ReturnType<typeof setCurrentPageIndex>>) {
  const total = store.getState().postPosition.pages.length;
  const pageIndex = action.payload;
  if (pageIndex === null) return;
  if (pageIndex < 0 || pageIndex >= total) return;

  return next(action);
}

function handleNextPage({
  store,
  next,
  action,
}: MiddlewareParams<ReturnType<typeof nextPage>>) {
  const current = store.getState().postPosition.currentPageIndex;
  const total = store.getState().postPosition.pages.length;

  if (current >= total - 1) {
    toast.success('마지막 페이지입니다.', {
      id: 'post-viewer',
      toasterId: 'post-viewer',
    });
    return;
  }

  return next(action);
}

function handlePreviousPage({
  store,
  next,
  action,
}: MiddlewareParams<ReturnType<typeof previousPage>>) {
  const current = store.getState().postPosition.currentPageIndex;
  if (current <= 0) {
    toast.success('첫 페이지입니다.', {
      id: 'post-viewer',
      toasterId: 'post-viewer',
    });
    return;
  }

  return next(action);
}
