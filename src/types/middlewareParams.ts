import { AppDispatch, RootState } from '@/lib/redux/store';
import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  MiddlewareAPI,
  UnknownAction,
} from '@reduxjs/toolkit';

type AnyActionCreator =
  | ActionCreatorWithPayload<unknown, string>
  | ActionCreatorWithoutPayload<string>;

export interface MiddlewareParams<T extends ReturnType<AnyActionCreator>> {
  store: MiddlewareAPI<AppDispatch, RootState>;
  next: (action: UnknownAction) => unknown;
  action: T;
}
