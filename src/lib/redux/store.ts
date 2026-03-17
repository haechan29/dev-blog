import { configureStore } from '@reduxjs/toolkit';

import bgmControllerReducer from '@/lib/redux/bgmControllerSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      bgmController: bgmControllerReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
