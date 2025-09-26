import { configureStore } from '@reduxjs/toolkit';

import postSidebarReducer from '@/lib/redux/postSidebarSlice';
import postToolbarReducer from '@/lib/redux/postToolbarSlice';
import { postViewerMiddleware } from '@/lib/redux/postViewerMiddleware';
import postViewerReducer from '@/lib/redux/postViewerSlice';
import { Middleware } from '@reduxjs/toolkit';

const middlewares: Middleware[] = [postViewerMiddleware];

export const store = configureStore({
  reducer: {
    postToolbar: postToolbarReducer,
    postSidebar: postSidebarReducer,
    postViewer: postViewerReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(middlewares),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
