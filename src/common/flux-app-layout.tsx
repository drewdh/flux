import AppLayout, { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import { Ref, useContext } from 'react';
import Flashbar from '@cloudscape-design/components/flashbar';

import { topNavSelector } from '../top-navigation/constants';
import { NotificationsContext, NotificationsProvider } from 'common/internal/notifications';

export default function FluxAppLayout(props: Props) {
  const notifications = useContext(NotificationsContext);

  return (
    <NotificationsProvider>
      <AppLayout
        {...props}
        notifications={<Flashbar items={notifications?.items ?? []} />}
        headerSelector={topNavSelector}
        navigationHide
      />
    </NotificationsProvider>
  );
}

type Props = Omit<
  AppLayoutProps,
  'footerSelector' | 'headerSelector' | 'notifications' | 'navigation' | 'navigationWidth'
> & {
  ref?: Ref<AppLayoutProps.Ref>;
};
