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
          common: {
            close: 'Close',
            cancel: 'Cancel',
            submit: 'Submit',
            optional: 'optional',
          },
          nav: {
            feedback: 'Feedback',
            search: {
              placeholder: 'Search live streams',
            },
          },
          feedback: {
            title: 'Feedback',
            description: 'Thank you for taking time to provide feedback.',
            typeLabel: 'Feedback type',
            typeGeneral: 'General feedback',
            typeFeatureRequest: 'Feature request',
            typeIssue: 'Report an issue',
            typeUi: 'UI feedback',
            messageLabel: 'Message',
            charactersRemaining_one: '{{count}} character remaining',
            charactersRemaining_other: '{{count}} characters remaining',
            satisfactionLabel: 'Are you satisfied with your experience?',
            satisfied: 'Yes',
            dissatisfied: 'No',
            emailLabel: 'Email',
            emailDescription:
              'If you would like to be contacted about your feedback, enter your email address.',
            emailPlaceholder: 'person@email.com',
            success: 'Successfully submitted feedback.',
            error: {
              general: 'Failed to submit feedback. Try again later.',
              maxMessage: 'Message must be 1,000 characters or fewer.',
              messageRequired: 'Enter a message.',
              satisfactionRequired: 'Choose a satisfaction.',
              invalidEmail: 'Enter a valid email.',
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
          common: {
            close: 'Schliessen',
            cancel: 'Abbrechen',
            submit: 'Einreichen',
            optional: 'fakultativ',
          },
          nav: {
            feedback: 'Feedback',
            search: {
              placeholder: 'Suche nach Live-Kanälen',
            },
          },
          feedback: {
            title: 'Feedback',
            description:
              'Vielen Dank, dass Sie sich die Zeit genommen haben, uns Feedback zu geben.',
            typeLabel: 'Typ',
            typeGeneral: 'Allgemeines Feedback',
            typeFeatureRequest: 'Funktionsanfrage',
            typeIssue: 'Ein Problem melden',
            typeUi: 'Feedback zur Benutzeroberfläche',
            messageLabel: 'Nachricht',
            charactersRemaining_one: '{{count}} verbleibendes Zeichen',
            charactersRemaining_other: '{{count}} verbleibende Zeichen',
            satisfactionLabel: 'Sind Sie mit deiner Erfahrung zufrieden?',
            satisfied: 'Ja',
            dissatisfied: 'Nein',
            emailLabel: 'E-Mail',
            emailDescription:
              'Wenn Sie wegen Ihres Feedbacks kontaktiert werden möchten, geben Sie Ihre E-Mail-Adresse ein.',
            emailPlaceholder: 'person@email.com',
            success: 'Das Feedback wurde erfolgreich eingereicht.',
            error: {
              general: 'Feedback konnte nicht eingereicht werden. Versuchen Sie es später erneut.',
              maxMessage: 'Die Nachricht muss 1.000 Zeichen oder weniger lang sein.',
              messageRequired: 'Geben Sie eine Nachricht ein.',
              satisfactionRequired: 'Wähle eine Befriedigung.',
              invalidEmail: 'Geben Sie eine gültige E-Mail ein.',
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
