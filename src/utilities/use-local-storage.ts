import { Dispatch, SetStateAction, useCallback, useState } from 'react';

export enum LocalStorageKey {
  Appearance = 'appearance',
  Language = 'i18nextLng',
  StreamLanguages = 'streamLanguages',
  DrawerSize = 'drawerSize',
}

/** Helper functions for accessing local storage that safely stringify and parse values */
export default function useLocalStorage<T>(key: LocalStorageKey, defaultValue: T): State<T> {
  const [item, setItem] = useState<T>(() => {
    if (key === LocalStorageKey.Language) {
      return localStorage.getItem(key) ?? defaultValue;
    }
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const updateItem = useCallback(
    (updater: T | ((prevValue: T) => T)): void => {
      const newValue = typeof updater === 'function' ? (updater as Function)(item) : updater;
      try {
        if (key === LocalStorageKey.Language) {
          localStorage.setItem(key, newValue);
        } else {
          const stringifiedValue = JSON.stringify(newValue);
          localStorage.setItem(key, stringifiedValue);
        }
        setItem(newValue);
      } catch (e) {
        console.warn(`Could not save value for key ${key}:`, item, e);
      }
    },
    [item, key]
  );

  return [item, updateItem];
}

type State<T> = [item: T, setItem: Dispatch<SetStateAction<T>>];
