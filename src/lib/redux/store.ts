import { configureStore } from '@reduxjs/toolkit';

import { postPositionMiddleware } from '@/lib/redux/post/postPositionMiddleware';
import postPositionReducer from '@/lib/redux/post/postPositionSlice';
import postReaderReducer from '@/lib/redux/post/postReaderSlice';
import postSidebarReducer from '@/lib/redux/post/postSidebarSlice';
import postToolbarReducer from '@/lib/redux/post/postToolbarSlice';
import postViewerReducer from '@/lib/redux/post/postViewerSlice';
import contentToolbarReducer from '@/lib/redux/write/contentToolbarSlice';
import writePostFormReducer from '@/lib/redux/write/writePostFormSlice';
import writePostReducer from '@/lib/redux/write/writePostSlice';
import { Middleware } from '@reduxjs/toolkit';

const middlewares: Middleware[] = [postPositionMiddleware];

export const store = configureStore({
  reducer: {
    postReader: postReaderReducer,
    postToolbar: postToolbarReducer,
    postSidebar: postSidebarReducer,
    postViewer: postViewerReducer,
    postPosition: postPositionReducer,
    writePost: writePostReducer,
    writePostForm: writePostFormReducer,
    contentToolbar: contentToolbarReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(middlewares),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
