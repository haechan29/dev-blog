import { BgmController } from '@/features/post/domain/model/bgmController';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: BgmController = {
  isPlaying: false,
  isError: false,
  isWaiting: false,
  isReady: false,
  currentContainerId: null,
  requestedBgm: {
    src: null,
    containerId: null,
  },
};

const bgmControllerSlice = createSlice({
  name: 'bgmController',
  initialState,
  reducers: {
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setIsError: (state, action: PayloadAction<boolean>) => {
      state.isError = action.payload;
    },
    setIsWaiting: (state, action: PayloadAction<boolean>) => {
      state.isWaiting = action.payload;
    },
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
    clearController: state => {
      state.isPlaying = false;
      state.isError = false;
      state.isWaiting = false;
      state.isReady = false;
    },
    setRequestedBgm: (
      state,
      action: PayloadAction<BgmController['requestedBgm']>
    ) => {
      state.requestedBgm = action.payload;
    },
    clearRequestedBgm: state => {
      state.currentContainerId = state.requestedBgm.containerId;
      state.requestedBgm = {
        src: null,
        containerId: null,
      };
    },
  },
});

export default bgmControllerSlice.reducer;
export const {
  setIsPlaying,
  setIsError,
  setIsWaiting,
  setIsReady,
  clearController,
  setRequestedBgm,
  clearRequestedBgm,
} = bgmControllerSlice.actions;
