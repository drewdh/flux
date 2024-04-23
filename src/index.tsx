import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router';
import { I18nProvider, importMessages } from '@cloudscape-design/components/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Pathname } from 'utilities/routes';
import './index.scss';
import './i18n';
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

interface GlobalFlags {
  removeHighContrastHeader?: boolean;
}
const symbol = Symbol.for('awsui-global-flags');
interface FlagsHolder {
  [symbol]?: GlobalFlags;
}
if (!(window as FlagsHolder)[symbol]) {
  (window as FlagsHolder)[symbol] = {};
}
(window as FlagsHolder)[symbol]!.removeHighContrastHeader = true;

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
        path: Pathname.Channel,
        element: <ChannelPage />,
      },
    ],
  },
]);

const locale = document.documentElement.lang;
const messages = await importMessages(locale);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        return (error as TwitchError).status !== 401;
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
