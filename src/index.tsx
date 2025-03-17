import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router';
import { I18nProvider, importMessages } from '@cloudscape-design/components/i18n';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Pathname } from 'utilities/routes';
import './index.scss';
import './utilities/rum-init';
import reportWebVitals from './reportWebVitals';
import App from './app/app';
const ErrorBoundary = lazy(() => import('common/error-boundary'));
import { SettingsProvider } from 'utilities/settings';
import { TwitchError } from './api/twitch-api-client';
import { FeedbackProvider } from './feedback/feedback-context';

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: Pathname.Fallback,
        // TODO: Log 404s since it could be a broken link
        lazy: () => lazyLoadPath('./pages/not-found-page'),
      },
      {
        path: Pathname.Live,
        lazy: () => lazyLoadPath('./pages/player/twitch-page'),
      },
      {
        path: Pathname.Welcome,
        lazy: () => lazyLoadPath('./pages/home/welcome-page'),
      },
      {
        path: Pathname.Home,
        lazy: () => lazyLoadPath('./pages/home/page'),
      },
      {
        path: Pathname.Results,
        lazy: () => lazyLoadPath('./pages/results/page'),
      },
      {
        path: Pathname.Settings,
        lazy: () => lazyLoadPath('./pages/settings/settings'),
      },
      {
        path: Pathname.Profile,
        lazy: () => lazyLoadPath('./pages/channel/page'),
      },
      {
        path: Pathname.Game,
        lazy: () => lazyLoadPath('./pages/game-detail/game-detail'),
      },
      {
        path: Pathname.Help,
        lazy: () => lazyLoadPath('./pages/help'),
      },
    ],
  },
]);

async function lazyLoadPath(path: string, componentName: string = 'default') {
  const file = await import(path);
  return { Component: file[componentName] };
}

const locale = 'en';
const messages = await importMessages(locale);
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      const invalidTokenErrors = [
        'Missing access token.',
        'invalid access token',
        'Invalid OAuth token',
      ];
      if (invalidTokenErrors.includes(error.message)) {
        const tokenInvalid = error.message !== 'Missing access token.';
        router.navigate(Pathname.Welcome, { state: { tokenInvalid } });
        localStorage.removeItem('access_token');
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: (_failureCount, error) => {
        if ((error as TwitchError).status === 401) {
          return false;
        }
        return error.message !== 'Missing access token.';
      },
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <FeedbackProvider>
      <SettingsProvider>
        <QueryClientProvider client={queryClient}>
          <I18nProvider locale={locale} messages={messages}>
            <RouterProvider router={router} />
          </I18nProvider>
        </QueryClientProvider>
      </SettingsProvider>
    </FeedbackProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
