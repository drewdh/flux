import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RouterProvider } from 'react-router';
import { I18nProvider, importMessages } from '@cloudscape-design/components/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Pathname } from 'utilities/routes';
import './index.scss';
import App from './app';
import reportWebVitals from './reportWebVitals';
import TwitchPlayerPage from './apps/twitch/player/twitch-page';
import TwitchPage from './apps/twitch/page';
import ErrorBoundary from 'common/error-boundary';

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
        element: <Navigate to={Pathname.Home} replace />,
      },
      {
        path: Pathname.TwitchChannel,
        element: <TwitchPlayerPage />,
      },
      {
        path: Pathname.Home,
        element: <TwitchPage />,
      },
    ],
  },
]);

const locale = document.documentElement.lang;
const messages = await importMessages(locale);
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nProvider locale={locale} messages={messages}>
        <RouterProvider router={router} />
      </I18nProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
