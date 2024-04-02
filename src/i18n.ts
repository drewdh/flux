import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: 'en',
  interpolation: {
    // not needed for react as it escapes by default
    escapeValue: false,
  },
  resources: {
    en: {
      translation: {
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
          },
        },
      },
    },
  },
});

export default i18n;
