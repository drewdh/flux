import AppLayout, { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import { Ref, useContext } from 'react';
import Flashbar from '@cloudscape-design/components/flashbar';
import { useLocalStorage, useSessionStorage } from 'usehooks-ts';

import { topNavSelector } from '../top-navigation/constants';
import { NotificationsContext, NotificationsProvider } from 'common/internal/notifications';
import { LocalStorageKey } from 'utilities/local-storage-keys';
import DebugTools from 'common/debug-tools';

export default function FluxAppLayout(props: Props) {
  const notifications = useContext(NotificationsContext);
  const [splitPanelOpen, setSplitPanelOpen] = useSessionStorage<boolean>(
    LocalStorageKey.DebugToolsOpen,
    false
  );
  const [splitPanelSize, setSplitPanelSize] = useLocalStorage<number | undefined>(
    LocalStorageKey.DebugToolsSize,
    undefined
  );

  return (
    <NotificationsProvider>
      <AppLayout
        {...props}
        headerSelector={topNavSelector}
        navigationHide
        notifications={<Flashbar items={notifications?.items ?? []} />}
        onSplitPanelResize={(event) => setSplitPanelSize(event.detail.size)}
        onSplitPanelToggle={(event) => setSplitPanelOpen(event.detail.open)}
        splitPanel={<DebugTools />}
        splitPanelOpen={splitPanelOpen}
        splitPanelSize={splitPanelSize}
        splitPanelPreferences={{ position: 'bottom' }}
      />
    </NotificationsProvider>
  );
}

type Props = Omit<
  AppLayoutProps,
  | 'footerSelector'
  | 'headerSelector'
  | 'notifications'
  | 'navigation'
  | 'navigationWidth'
  | 'onSplitPanelPreferencesChange'
  | 'onSplitPanelResize'
  | 'onSplitPanelToggle'
  | 'splitPanel'
  | 'splitPanelOpen'
  | 'splitPanelPreferences'
  | 'splitPanelSize'
> & {
  ref?: Ref<AppLayoutProps.Ref>;
};
