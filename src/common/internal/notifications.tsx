import { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { FlashbarProps } from '@cloudscape-design/components/flashbar';
import without from 'lodash/without';
import { ButtonProps } from '@cloudscape-design/components/button';
import { v4 as uuidV4 } from 'uuid';

interface NotificationsClient {
  addNotification: (item: FlashbarProps.MessageDefinition) => void;
  items: FlashbarProps.MessageDefinition[];
}

export const NotificationsContext = createContext<NotificationsClient | null>(null);

export function NotificationsProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<FlashbarProps.MessageDefinition[]>([]);

  function dismissNotification(id: string) {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === id);
      if (itemToRemove) {
        return without(prevItems, itemToRemove);
      }
      return prevItems;
    });
  }

  const addNotification = useCallback((item: FlashbarProps.MessageDefinition): void => {
    const id = item.id ?? uuidV4();
    const newItem: FlashbarProps.MessageDefinition = {
      ...item,
      id,
      onDismiss: (event: CustomEvent<ButtonProps.ClickDetail>) => {
        item.onDismiss?.(event);
        dismissNotification(id);
      },
    };
    setItems((prevItems) => {
      return [...prevItems, newItem];
    });
  }, []);

  return <NotificationsContext value={{ items, addNotification }}>{children}</NotificationsContext>;
}
