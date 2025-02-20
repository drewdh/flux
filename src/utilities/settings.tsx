import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import LanguageDetector from 'i18next-browser-languagedetector';
import { applyMode, Mode } from '@cloudscape-design/global-styles';

import useLocalStorage, { LocalStorageKey } from 'utilities/use-local-storage';

function handleMatchChange(event: MediaQueryListEvent) {
  const mode = event.matches ? Mode.Dark : Mode.Light;
  applyMode(mode);
}

export enum Appearance {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

const defaultAppearance = Appearance.Light;

const noop = () => {};

const SettingsContext = createContext<UseSettingsResult>({
  appearance: defaultAppearance,
  setAppearance: noop,
  language: '',
  setLanguage: noop,
  streamLanguages: [],
  setStreamLanguages: noop,
});

let isAppearanceInitialized = false;
export function SettingsProvider({ children }: PropsWithChildren) {
  const [appearance, setAppearance] = useLocalStorage<Appearance>(
    LocalStorageKey.Appearance,
    defaultAppearance
  );
  const [language, setLanguage] = useLocalStorage<string>(LocalStorageKey.Language, '');
  const [streamLanguages, setStreamLanguages] = useLocalStorage<string[]>(
    LocalStorageKey.StreamLanguages,
    []
  );
  const [match] = useState(window.matchMedia('(prefers-color-scheme: dark)'));

  const handleAppearanceChange = useCallback(
    (value: Appearance): void => {
      setAppearance(value);
      if (value === Appearance.System) {
        match.addEventListener('change', handleMatchChange);
        applyMode(match.matches ? Mode.Dark : Mode.Light);
      } else {
        match.removeEventListener('change', handleMatchChange);
        applyMode(value === Appearance.Dark ? Mode.Dark : Mode.Light);
      }
    },
    [setAppearance, match]
  );

  const handleLanguageChange = useCallback(
    (value: string) => {
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
      // i18n.changeLanguage(value || defaultLang);
      setLanguage(value);
    },
    [setLanguage]
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
        streamLanguages,
        setStreamLanguages,
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
  streamLanguages: string[];
  setStreamLanguages: (languages: string[]) => void;
}
