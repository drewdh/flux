import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en-US',
    interpolation: {
      // not needed for react as it escapes by default
      escapeValue: false,
    },
    detection: {
      // order: ['localStorage'],
      caches: [],
    },
    resources: {
      'en-US': {
        translation: {
          nav: {
            feedback: 'Feedback',
            search: {
              placeholder: 'Search live channels',
            },
          },
          time: {
            now: 'Just now',
            minutes_one: '{{count}} minute ago',
            minutes_other: '{{count}} minutes ago',
            hours_one: '{{count}} hour ago',
            hours_other: '{{count}} hours ago',
            days_one: '{{count}} day ago',
            days_other: '{{count}} days ago',
            weeks_one: '{{count}} week ago',
            weeks_other: '{{count}} weeks ago',
            months_one: '{{count}} month ago',
            months_other: '{{count}} months ago',
            years_one: '{{count}} year ago',
            years_other: '{{count}} years ago',
          },
          settings: {
            title: 'Settings',
            appearance: {
              title: 'Appearance',
              light: 'Light',
              dark: 'Dark',
              system: 'Use system settings',
            },
            language: {
              title: 'Language',
              system: 'Use system settings',
            },
          },
        },
      },
      de: {
        translation: {
          nav: {
            feedback: 'Rückmeldung',
            search: {
              placeholder: 'Suche nach Live-Kanälen',
            },
          },
          time: {
            now: 'Gerade eben',
            minutes_one: 'vor {{count}} Minute',
            minutes_other: 'vor {{count}} Minuten',
            hours_one: 'vor {{count}} Stunde',
            hours_other: 'vor {{count}} Stunden',
            days_one: 'vor {{count}} Tag',
            days_other: 'vor {{count}} Tagen',
            weeks_one: 'vor {{count}} Woche',
            weeks_other: 'vor {{count}} Wochen',
            months_one: 'vor {{count}} Monat',
            months_other: 'vor {{count}} Monaten',
            years_one: 'vor {{count}} Jahr',
            years_other: 'vor {{count}} Jahren',
          },
          settings: {
            title: 'Einstellungen',
            appearance: {
              title: 'Aussehen',
              light: 'Licht',
              dark: 'Dunkel',
              system: 'Systemeinstellungen verwenden',
            },
            language: {
              title: 'Sprache',
              system: 'Systemeinstellungen verwenden',
            },
          },
        },
      },
    },
  });

export default i18n;
