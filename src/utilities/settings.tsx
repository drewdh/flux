import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

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
  language: '',
  setLanguage: () => {},
});

let isAppearanceInitialized = false;
export function SettingsProvider({ children }: PropsWithChildren) {
  const { i18n } = useTranslation();
  const [appearance, setAppearance] = useLocalStorage<Appearance>(
    LocalStorageKey.Appearance,
    defaultAppearance
  );
  const [language, setLanguage] = useLocalStorage<string>(LocalStorageKey.Language, '');
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

  const handleLanguageChange = useCallback(
    (value: string) => {
      console.log(value);
      const detector = new LanguageDetector();
      // Use default order except exclude local storage since it hasn't been updated yet
      const detected = detector.detect([
        'querystring',
        'cookie',
        'sessionStorage',
        'navigator',
        'htmlTag',
      ]);
      let defaultLang = '';
      if (typeof detected === 'string') {
        defaultLang = detected;
      } else if (Array.isArray(detected)) {
        defaultLang = detected[0];
      } else {
        defaultLang = 'en-US';
      }
      console.log(defaultLang);
      i18n.changeLanguage(value || defaultLang);
      setLanguage(value);
    },
    [i18n, setLanguage]
  );

  useEffect(() => {
    if (isAppearanceInitialized) {
      return;
    }
    handleAppearanceChange(appearance);
    isAppearanceInitialized = true;
  }, [appearance, handleAppearanceChange]);

  return (
    <SettingsContext.Provider
      value={{
        appearance,
        setAppearance: handleAppearanceChange,
        language,
        setLanguage: handleLanguageChange,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);

interface UseSettingsResult {
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
  language: string;
  setLanguage: (language: string) => void;
}
