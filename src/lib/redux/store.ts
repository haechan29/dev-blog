import { configureStore } from '@reduxjs/toolkit';

import bgmControllerReducer from '@/lib/redux/bgmControllerSlice';
import postReaderReducer from '@/lib/redux/post/postReaderSlice';
import postSidebarReducer from '@/lib/redux/post/postSidebarSlice';
import postToolbarReducer from '@/lib/redux/post/postToolbarSlice';
import { postViewerMiddleware } from '@/lib/redux/post/postViewerMiddleware';
import postViewerReducer from '@/lib/redux/post/postViewerSlice';
import contentToolbarReducer from '@/lib/redux/write/contentToolbarSlice';
import writePostFormReducer from '@/lib/redux/write/writePostFormSlice';
import writePostReducer from '@/lib/redux/write/writePostSlice';
import { Middleware } from '@reduxjs/toolkit';

const middlewares: Middleware[] = [postViewerMiddleware];

export const makeStore = () => {
  return configureStore({
    reducer: {
      postReader: postReaderReducer,
      postToolbar: postToolbarReducer,
      postSidebar: postSidebarReducer,
      postViewer: postViewerReducer,
      writePost: writePostReducer,
      writePostForm: writePostFormReducer,
      contentToolbar: contentToolbarReducer,
      bgmController: bgmControllerReducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(middlewares),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
