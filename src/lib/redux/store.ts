import { configureStore } from '@reduxjs/toolkit';

import bgmControllerReducer from '@/lib/redux/bgmControllerSlice';
import postSidebarReducer from '@/lib/redux/post/postSidebarSlice';
import postToolbarReducer from '@/lib/redux/post/postToolbarSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      postToolbar: postToolbarReducer,
      postSidebar: postSidebarReducer,
      bgmController: bgmControllerReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
