import {
  nextPage,
  previousPage,
  setCurrentPageIndex,
} from '@/lib/redux/postPositionSlice';
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
  const totalPage = store.getState().postPosition.totalPage;
  if (totalPage === null) return;

  const pageIndex = action.payload;
  if (pageIndex === null) return;
  if (pageIndex < 0 || pageIndex >= totalPage) return;

  return next(action);
}

function handleNextPage({
  store,
  next,
  action,
}: MiddlewareParams<ReturnType<typeof nextPage>>) {
  const totalPage = store.getState().postPosition.totalPage;
  const currentPageIndex = store.getState().postPosition.currentPageIndex;
  if (totalPage === null || currentPageIndex === null) return;

  if (currentPageIndex >= totalPage - 1) {
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
  const currentPageIndex = store.getState().postPosition.currentPageIndex;
  if (currentPageIndex === null) return;

  if (currentPageIndex <= 0) {
    toast.success('첫 페이지입니다.', {
      id: 'post-viewer',
      toasterId: 'post-viewer',
    });
    return;
  }

  return next(action);
}
