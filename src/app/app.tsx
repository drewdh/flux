import '@cloudscape-design/global-styles/index.css';
import { Outlet } from 'react-router';

import TopNavigation from '../top-navigation';
import ErrorBoundary from 'common/error-boundary';

export default function App() {
  return (
    <>
      <TopNavigation />
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </>
  );
}
