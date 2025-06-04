import SplitPanel from '@cloudscape-design/components/split-panel';
import { useSessionStorage } from 'usehooks-ts';
import Tabs from '@cloudscape-design/components/tabs';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import StatusIndicator, {
  StatusIndicatorProps,
} from '@cloudscape-design/components/status-indicator';

import { LocalStorageKey } from 'utilities/local-storage-keys';
import { EventSubStatus } from 'common/use-chat-messages';

enum TabId {
  EventSub = 'eventSub',
}

const statusType: Record<EventSubStatus, StatusIndicatorProps.Type> = {
  [EventSubStatus.Closed]: 'stopped',
  [EventSubStatus.Error]: 'error',
  [EventSubStatus.Connected]: 'success',
};
const statusLabel: Record<EventSubStatus, string> = {
  [EventSubStatus.Closed]: 'Closed',
  [EventSubStatus.Error]: 'Error',
  [EventSubStatus.Connected]: 'Connected',
};

export default function DebugTools() {
  const [isVisible] = useSessionStorage(LocalStorageKey.DebugToolsEnabled, false);
  const [status] = useSessionStorage(LocalStorageKey.EventSubStatus, EventSubStatus.Closed);

  if (!isVisible) {
    return null;
  }

  return (
    <SplitPanel closeBehavior={isVisible ? 'collapse' : 'hide'} header="Debug tools">
      <Tabs
        tabs={[
          {
            label: 'EventSub',
            content: (
              <KeyValuePairs
                items={[
                  {
                    label: 'Connection status',
                    value: (
                      <StatusIndicator type={statusType[status]}>
                        {statusLabel[status]}
                      </StatusIndicator>
                    ),
                  },
                ]}
              />
            ),
            id: TabId.EventSub,
          },
        ]}
      />
    </SplitPanel>
  );
}
