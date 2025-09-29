import {
  nextPage,
  previousPage,
  setPageIndex,
  setPaging,
} from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { MiddlewareParams } from '@/types/middlewareParams';
import { isAnyOf, Middleware } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

export const postViewerMiddleware: Middleware<
  unknown,
  RootState,
  AppDispatch
> = store => next => action => {
  if (isAnyOf(setPageIndex)(action)) {
    return handleSetPageIndex({ store, next, action });
  }

  if (isAnyOf(setPaging)(action)) {
    return handleSetPaging({ store, next, action });
  }

  if (isAnyOf(nextPage)(action)) {
    return handleNextPage({ store, next, action });
  }

  if (isAnyOf(previousPage)(action)) {
    return handlePreviousPage({ store, next, action });
  }

  return next(action);
};

function handleSetPageIndex({
  store,
  next,
  action,
}: MiddlewareParams<ReturnType<typeof setPageIndex>>) {
  const paging = store.getState().postViewer.paging;
  if (!paging) return;

  const pageIndex = action.payload;
  if (pageIndex < 0 || pageIndex >= paging.total) return;

  return next(action);
}

function handleSetPaging({
  store,
  next,
  action,
}: MiddlewareParams<ReturnType<typeof setPaging>>) {
  const paging = action.payload;
  if (!paging) return next(action);

  const { index, total } = paging;
  if (index < 0 || index >= total) return;

  return next(action);
}

function handleNextPage({
  store,
  next,
  action,
}: MiddlewareParams<ReturnType<typeof nextPage>>) {
  const paging = store.getState().postViewer.paging;
  if (!paging) return;
  if (paging.index >= paging.total - 1) {
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
  const paging = store.getState().postViewer.paging;
  if (!paging) return;
  if (paging.index <= 0) {
    toast.success('첫 페이지입니다.', {
      id: 'post-viewer',
      toasterId: 'post-viewer',
    });
    return;
  }

  return next(action);
}
