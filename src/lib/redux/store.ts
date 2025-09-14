import { configureStore } from '@reduxjs/toolkit';

import postToolbarReducer from '@/lib/redux/postToolbarSlice';

export const store = configureStore({
  reducer: {
    postToolbar: postToolbarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
