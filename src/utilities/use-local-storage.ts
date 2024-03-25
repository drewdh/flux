import { Dispatch, SetStateAction, useCallback, useState } from 'react';

export enum LocalStorageKey {
  GlobalSettings = 'globalSettings',
  PomodoroSettings = 'pomodoroSettings',
  IsPreviewNotificationDismissed = 'previewNotification',
  DashboardLayout = 'dashboardLayout',
  WidgetPanelSize = 'widgetPanelSize',
  CoffeeWeight = 'coffeeWeight',
  DiabloWorldTier = 'diabloWorldTier',
  DiabloPlayerLevel = 'diabloPlayerLevel',
  DiabloSigilTier = 'diabloSigilTier',
  DiabloMonsterLevelOffset = 'diabloMonsterLevelOffset',
  ContentDensity = 'contentDensity',
  VisualMode = 'visualMode',
  IsNewVisitor = 'isNewVisitor',
}

/** Helper functions for accessing local storage that safely stringify and parse values */
export default function useLocalStorage<T>(key: LocalStorageKey, defaultValue: T): State<T> {
  const [item, setItem] = useState<T>(() => {
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
        const stringifiedValue = JSON.stringify(newValue);
        localStorage.setItem(key, stringifiedValue);
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
