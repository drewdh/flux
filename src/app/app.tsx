import '@cloudscape-design/global-styles/index.css';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router';

import TopNavigation from '../top-navigation';
import ErrorBoundary from 'common/error-boundary';
import FluxAppLayout from 'common/flux-app-layout';

export default function App() {
  const location = useLocation();

  return (
    <>
      <TopNavigation />
      <ErrorBoundary location={location}>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

function Loading() {
  return (
    <FluxAppLayout
      content={<StatusIndicator type="loading">Loading</StatusIndicator>}
      navigationHide
      toolsHide
    />
  );
}
