import { configureStore } from '@reduxjs/toolkit';

import postToolbarReducer from '@/lib/redux/postToolbarSlice';
import postSidebarReducer from '@/lib/redux/postSidebarSlice';

export const store = configureStore({
  reducer: {
    postToolbar: postToolbarReducer,
    postSidebar: postSidebarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
