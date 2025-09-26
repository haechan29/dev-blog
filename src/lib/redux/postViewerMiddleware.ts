import {
  nextPage,
  previousPage,
  setPageIndex,
  setPaging,
} from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { isAnyOf, Middleware } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

export const postViewerMiddleware: Middleware<
  unknown,
  RootState,
  AppDispatch
> = store => next => action => {
  if (isAnyOf(setPageIndex)(action)) {
    const paging = store.getState().postViewer.paging;
    if (!paging) return;

    const pageIndex = action.payload;
    if (pageIndex < 0 || pageIndex >= paging.total) return;
  }
  if (isAnyOf(setPaging)(action)) {
    const paging = action.payload;
    if (!paging) return next(action);

    const { index, total } = paging;
    if (index < 0 || index >= total) return;
  }
  if (isAnyOf(nextPage)(action)) {
    const paging = store.getState().postViewer.paging;
    if (!paging) return;
    if (paging.index >= paging.total - 1) {
      toast.success('마지막 페이지입니다.', {
        id: 'post-viewer',
        toasterId: 'post-viewer',
      });
      return;
    }
  }
  if (isAnyOf(previousPage)(action)) {
    const paging = store.getState().postViewer.paging;
    if (!paging) return;
    if (paging.index <= 0) {
      toast.success('첫 페이지입니다.', {
        id: 'post-viewer',
        toasterId: 'post-viewer',
      });
      return;
    }
  }

  return next(action);
};
