import { Dispatch, SetStateAction } from 'react';

export type SetState<T> = Dispatch<SetStateAction<T>>;

export function update<T>(action: SetStateAction<T>, prev: T): T {
  return typeof action === 'function'
    ? (action as (prev: T) => T)(prev)
    : action;
}
