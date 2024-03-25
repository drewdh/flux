import AppLayout from '@cloudscape-design/components/app-layout';
import { Outlet } from 'react-router';

export default function AuthPage() {
  return <AppLayout maxContentWidth={450} toolsHide navigationHide content={<Outlet />} />;
}
