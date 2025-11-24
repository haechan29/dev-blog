import { writePostSteps } from '@/features/write/constants/writePostStep';
import WritePost from '@/features/write/domain/model/writePost';
import { ContentEditorStatus } from '@/features/write/domain/types/contentEditorStatus';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: WritePost = {
  currentStepId: 'write',
  contentEditorStatus: {
    isFocused: false,
    cursorPosition: 0,
    cursorOffset: 0,
  },
};

const writePostSlice = createSlice({
  name: 'writePost',
  initialState,
  reducers: {
    setCurrentStepId: (
      state,
      action: PayloadAction<keyof typeof writePostSteps>
    ) => {
      state.currentStepId = action.payload;
    },
    setContentEditorStatus: (
      state,
      action: PayloadAction<Partial<ContentEditorStatus>>
    ) => {
      state.contentEditorStatus = {
        ...state.contentEditorStatus,
        ...action.payload,
      };
    },
  },
});

export default writePostSlice.reducer;
export const { setCurrentStepId, setContentEditorStatus } =
  writePostSlice.actions;
