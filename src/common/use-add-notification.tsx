import { FlashbarProps } from '@cloudscape-design/components/flashbar';
import { useContext } from 'react';

import { NotificationsContext } from 'common/internal/notifications';

export default function useAddNotification(): (
  notification: FlashbarProps.MessageDefinition
) => void {
  const context = useContext(NotificationsContext);

  return context?.addNotification ?? (() => {});
}
