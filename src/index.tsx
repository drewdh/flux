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

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: Pathname.Fallback,
        // TODO: Log 404s since it could be a broken link
        lazy: async () => {
          const file = await import('./pages/not-found-page');
          return { Component: file.default };
        },
      },
      {
        path: Pathname.Live,
        lazy: async () => {
          const file = await import('./pages/player/twitch-page');
          return { Component: file.default };
        },
      },
      {
        path: Pathname.Welcome,
        lazy: async () => {
          const file = await import('./pages/home/welcome-page');
          return { Component: file.default };
        },
      },
      {
        path: Pathname.Home,
        lazy: async () => {
          const file = await import('./pages/home/page');
          return { Component: file.default };
        },
      },
      {
        path: Pathname.Results,
        lazy: async () => {
          const file = await import('./pages/results/page');
          return { Component: file.default };
        },
      },
      {
        path: Pathname.Settings,
        lazy: async () => {
          const file = await import('./pages/settings/settings');
          return { Component: file.default };
        },
      },
      {
        path: Pathname.Profile,
        lazy: async () => {
          const file = await import('./pages/channel/page');
          return { Component: file.default };
        },
      },
      {
        path: Pathname.Game,
        lazy: async () => {
          const file = await import('./pages/game-detail/game-detail');
          return { Component: file.default };
        },
      },
      {
        path: Pathname.Help,
        lazy: async () => {
          const file = await import('./pages/help');
          return { Component: file.default };
        },
      },
      {
        path: Pathname.PopularCategories,
        lazy: async () => {
          const file = await import('./pages/popular-categories');
          return { Component: file.default };
        },
      },
    ],
  },
]);

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
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <QueryClientProvider client={queryClient}>
        <I18nProvider locale={locale} messages={messages}>
          <RouterProvider router={router} />
        </I18nProvider>
      </QueryClientProvider>
    </SettingsProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
