import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router';
import { I18nProvider, importMessages } from '@cloudscape-design/components/i18n';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Pathname } from 'utilities/routes';
import './index.scss';
import './i18n';
import './utilities/rum-init';
import App from './app/app';
import reportWebVitals from './reportWebVitals';
import TwitchPlayerPage from './pages/player/twitch-page';
import TwitchPage from './pages/home/page';
import ResultsPage from './pages/results/page';
import ErrorBoundary from 'common/error-boundary';
import NotFoundPage from './pages/not-found-page';
import SettingsPage from './pages/settings/settings';
import { SettingsProvider } from 'utilities/settings';
import { TwitchError } from './api/twitch-api-client';
import ChannelPage from './pages/channel/page';
import GameDetailPage from './pages/game-detail/game-detail';
import { FeedbackProvider } from './feedback/feedback-context';
import WelcomePage from './pages/home/welcome-page';

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: Pathname.Fallback,
        // TODO: Log 404s since it could be a broken link
        element: <NotFoundPage />,
      },
      {
        path: Pathname.Live,
        element: <TwitchPlayerPage />,
      },
      {
        path: Pathname.Welcome,
        element: <WelcomePage />,
      },
      {
        path: Pathname.Home,
        element: <TwitchPage />,
      },
      {
        path: Pathname.Results,
        element: <ResultsPage />,
      },
      {
        path: Pathname.Settings,
        element: <SettingsPage />,
      },
      {
        path: Pathname.Profile,
        element: <ChannelPage />,
      },
      {
        path: Pathname.Game,
        element: <GameDetailPage />,
      },
    ],
  },
]);

const locale = document.documentElement.lang;
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
