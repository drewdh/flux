import AppLayout, { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import { forwardRef, Ref, useContext } from 'react';
import Flashbar from '@cloudscape-design/components/flashbar';
import { useLocation } from 'react-router';
import SideNavigation, { SideNavigationProps } from '@cloudscape-design/components/side-navigation';
import { ButtonProps } from '@cloudscape-design/components/button';

import { footerSelector } from '../footer/constants';
import { topNavSelector } from '../top-navigation/constants';
import { NotificationsContext, NotificationsProvider } from 'common/internal/notifications';
import { Pathname } from 'utilities/routes';
import widgetDetails from 'common/widget-details';
import useFollow from 'common/use-follow';
import Box from '@cloudscape-design/components/box';
import Popover from '@cloudscape-design/components/popover';

function PreviewPopover() {
  return (
    <Box color="text-status-info" display="inline">
      <Popover
        header="Preview app"
        size="medium"
        triggerType="text"
        content="This app is in preview. Functionality is limited and can change at any time."
        renderWithPortal={true}
      >
        <Box color="text-status-info" fontSize="body-s" fontWeight="bold">
          Preview
        </Box>
      </Popover>
    </Box>
  );
}

const Layout = forwardRef(function DhAppLayout(props: Props, ref: Ref<AppLayoutProps.Ref>) {
  const notifications = useContext(NotificationsContext);
  const { pathname } = useLocation();
  const follow = useFollow();

  function handleFollow(
    event: CustomEvent<SideNavigationProps.FollowDetail | ButtonProps.FollowDetail>
  ) {
    const { href } = event.detail;
    if (!href) {
      return;
    }
    follow({ href, event });
  }

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
