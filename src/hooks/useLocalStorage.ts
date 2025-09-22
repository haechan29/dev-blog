'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  serializer?: {
    parse: (str: string) => T;
    stringify: (obj: T) => string;
  },
  syncAcrossTabs: boolean = false
): [T, (value: T) => void] {
  const defaultSerializer = useMemo(
    () =>
      serializer ?? {
        parse: JSON.parse,
        stringify: JSON.stringify,
      },
    [serializer]
  );

  const [storedValue, setStoredValue] = useState(initialValue);

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        localStorage.setItem(key, defaultSerializer.stringify(value));
      } catch {}
    },
    [key, defaultSerializer]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const item = localStorage.getItem(key);
    if (item) {
      try {
        const newValue = defaultSerializer.parse(item);
        setStoredValue(newValue);
      } catch {}
    }
  }, [defaultSerializer, key]);

  useEffect(() => {
    if (!syncAcrossTabs) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue != null) {
        try {
          const newValue = defaultSerializer.parse(e.newValue);
          setStoredValue(newValue);
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [syncAcrossTabs, defaultSerializer, key, setStoredValue]);

  return [storedValue, setValue];
}
