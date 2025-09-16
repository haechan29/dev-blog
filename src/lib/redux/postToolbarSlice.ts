import { Heading } from '@/features/post/domain/model/post';
import PostToolbar from '@/features/post/domain/model/postToolbar';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostToolbar = {
  type: 'empty',
  tag: null,
  selectedHeading: null,
  headings: [],
};

const postToolbarSlice = createSlice({
  name: 'postToolbar',
  initialState,
  reducers: {
    setType: (state, action: PayloadAction<PostToolbar['type']>) => {
      state.type = action.payload;
    },
    setTag: (state, action: PayloadAction<string | null>) => {
      state.tag = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setSelectedHeading: (state, action: PayloadAction<Heading>) => {
      state.selectedHeading = action.payload;
    },
    setHeadings: (state, action: PayloadAction<Heading[]>) => {
      state.headings = action.payload;
    },
  },
});

export default postToolbarSlice.reducer;
export const { setType, setTag, setTitle, setSelectedHeading, setHeadings } =
  postToolbarSlice.actions;
