'use client';

import { useEffect, useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  serializer: {
    parse: (str: string) => T;
    stringify: (obj: T) => string;
  } = {
    parse: (str: string) => JSON.parse(str),
    stringify: (obj: T) => JSON.stringify(obj),
  },
  syncAcrossTabs: boolean = false
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState(initialValue);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, serializer.stringify(value));
    } catch {}
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const item = localStorage.getItem(key);
    if (item) {
      try {
        const newValue = serializer.parse(item);
        setStoredValue(newValue);
      } catch {}
    }
  }, [key, serializer]);

  useEffect(() => {
    if (!syncAcrossTabs) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue != null) {
        try {
          const newValue = serializer.parse(e.newValue);
          setStoredValue(newValue);
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [syncAcrossTabs, serializer, key, setStoredValue]);

  return [storedValue, setValue];
}
