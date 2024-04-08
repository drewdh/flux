import AppLayout, { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import { forwardRef, Ref, useContext } from 'react';
import Flashbar from '@cloudscape-design/components/flashbar';

import { footerSelector } from '../footer/constants';
import { topNavSelector } from '../top-navigation/constants';
import { NotificationsContext, NotificationsProvider } from 'common/internal/notifications';

const Layout = forwardRef(function DhAppLayout(props: Props, ref: Ref<AppLayoutProps.Ref>) {
  const notifications = useContext(NotificationsContext);

  return (
    <AppLayout
      {...props}
      ref={ref}
      notifications={<Flashbar items={notifications?.items ?? []} />}
      footerSelector={footerSelector}
      headerSelector={topNavSelector}
      navigationHide
    />
  );
});

export default forwardRef(function (props: Props, ref: Ref<AppLayoutProps.Ref>) {
  return (
    <NotificationsProvider>
      <Layout {...props} ref={ref} />
    </NotificationsProvider>
  );
});

type Props = Omit<
  AppLayoutProps,
  'footerSelector' | 'headerSelector' | 'notifications' | 'navigation' | 'navigationWidth'
>;
