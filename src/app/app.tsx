import '@cloudscape-design/global-styles/index.css';
import { Outlet, useLocation } from 'react-router';

import TopNavigation from '../top-navigation';
import ErrorBoundary from 'common/error-boundary';

export default function App() {
  const location = useLocation();

  return (
    <>
      <TopNavigation />
      <ErrorBoundary location={location}>
        <Outlet />
      </ErrorBoundary>
    </>
  );
}
