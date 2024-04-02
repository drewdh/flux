import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import useLocalStorage, { LocalStorageKey } from 'utilities/use-local-storage';

function setDarkMode(isEnabled: boolean) {
  if (isEnabled) {
    document.body.classList.add('awsui-dark-mode');
  } else {
    document.body.classList.remove('awsui-dark-mode');
  }
}
function handleMatchChange(event: MediaQueryListEvent) {
  setDarkMode(event.matches);
}

export enum Appearance {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

const defaultAppearance = Appearance.Light;

const SettingsContext = createContext<UseSettingsResult>({
  appearance: defaultAppearance,
  setAppearance: () => {},
});

let isAppearanceInitialized = false;
export function SettingsProvider({ children }: PropsWithChildren) {
  const [appearance, setAppearance] = useLocalStorage<Appearance>(
    LocalStorageKey.Appearance,
    defaultAppearance
  );
  const [match] = useState(window.matchMedia('(prefers-color-scheme: dark)'));

  const handleAppearanceChange = useCallback(
    (value: Appearance): void => {
      setAppearance(value);
      if (value === Appearance.System) {
        match.addEventListener('change', handleMatchChange);
        setDarkMode(match.matches);
      } else {
        match.removeEventListener('change', handleMatchChange);
        setDarkMode(value === Appearance.Dark);
      }
    },
    [setAppearance, match]
  );

  useEffect(() => {
    if (isAppearanceInitialized) {
      return;
    }
    handleAppearanceChange(appearance);
    isAppearanceInitialized = true;
  }, [appearance, handleAppearanceChange]);

  return (
    <SettingsContext.Provider value={{ appearance, setAppearance: handleAppearanceChange }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);

interface UseSettingsResult {
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
}
