import { FlashbarProps } from '@cloudscape-design/components/flashbar';
import { useContext } from 'react';

import { NotificationsContext } from 'common/internal/notifications';

interface MessageDefinition extends FlashbarProps.MessageDefinition {
  id: string;
}

export default function useAddNotification(): (notification: MessageDefinition) => void {
  const context = useContext(NotificationsContext);

  return context?.addNotification ?? (() => {});
}
