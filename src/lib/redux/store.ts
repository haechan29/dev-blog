import { configureStore } from '@reduxjs/toolkit';

import { postPositionMiddleware } from '@/lib/redux/postPositionMiddleware';
import postPositionReducer from '@/lib/redux/postPositionSlice';
import postSidebarReducer from '@/lib/redux/postSidebarSlice';
import postToolbarReducer from '@/lib/redux/postToolbarSlice';
import postViewerReducer from '@/lib/redux/postViewerSlice';
import { Middleware } from '@reduxjs/toolkit';

const middlewares: Middleware[] = [postPositionMiddleware];

export const store = configureStore({
  reducer: {
    postToolbar: postToolbarReducer,
    postSidebar: postSidebarReducer,
    postViewer: postViewerReducer,
    postPosition: postPositionReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(middlewares),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
