import {
  nextPage,
  previousPage,
  setPageIndex,
  setPaging,
} from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { isAnyOf, Middleware } from '@reduxjs/toolkit';

export const postViewerMiddleware: Middleware<
  unknown,
  RootState,
  AppDispatch
> = store => next => action => {
  if (isAnyOf(setPageIndex, setPaging)(action)) {
    const state = store.getState();
    const paging = state.postViewer.paging;
    if (!paging) return;
    if (paging.index < 0 || paging.index >= paging.total) {
      console.log('유효하지 않은 페이지');
      return;
    }
  }
  if (isAnyOf(nextPage)(action)) {
    const state = store.getState();
    const paging = state.postViewer.paging;
    if (!paging) return;
    if (paging.index >= paging.total - 1) {
      console.log('마지막 페이지');
      return;
    }
  }
  if (isAnyOf(previousPage)(action)) {
    const state = store.getState();
    const paging = state.postViewer.paging;
    if (!paging) return;
    if (paging.index <= 0) {
      console.log('첫 페이지');
      return;
    }
  }

  return next(action);
};
