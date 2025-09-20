import { configureStore } from '@reduxjs/toolkit';

import postSidebarReducer from '@/lib/redux/postSidebarSlice';
import postToolbarReducer from '@/lib/redux/postToolbarSlice';
import postViewerReducer from '@/lib/redux/postViewerSlice';

export const store = configureStore({
  reducer: {
    postToolbar: postToolbarReducer,
    postSidebar: postSidebarReducer,
    postViewer: postViewerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
