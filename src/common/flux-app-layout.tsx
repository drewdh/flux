import AppLayout, { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import { Ref, useContext, useEffect, useState } from 'react';
import Flashbar from '@cloudscape-design/components/flashbar';
import { useLocalStorage } from 'usehooks-ts';

import { topNavSelector } from '../top-navigation/constants';
import { NotificationsContext, NotificationsProvider } from 'common/internal/notifications';
import { LocalStorageKey } from 'utilities/use-local-storage';
import DebugTools from 'common/debug-tools';

export default function FluxAppLayout(props: Props) {
  const notifications = useContext(NotificationsContext);
  const [splitPanelVisible] = useLocalStorage(LocalStorageKey.DebugToolsVisible, false);
  const [splitPanelOpen, setSplitPanelOpen] = useState<boolean>(false);
  const [splitPanelSize, setSplitPanelSize] = useLocalStorage<number | undefined>(
    LocalStorageKey.DebugToolsSize,
    undefined
  );

  // When the visibility of the debug tools changes, open/close the panel
  useEffect(() => {
    setSplitPanelOpen(splitPanelVisible);
  }, [splitPanelVisible]);

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
