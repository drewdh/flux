import { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { FlashbarProps } from '@cloudscape-design/components/flashbar';
import without from 'lodash/without';
import { ButtonProps } from '@cloudscape-design/components/button';

interface NotificationsClient {
  addNotification: (item: FlashbarProps.MessageDefinition & { id: string }) => void;
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

  const addNotification = useCallback(
    (item: FlashbarProps.MessageDefinition & { id: string }): void => {
      const newItem: FlashbarProps.MessageDefinition = {
        ...item,
        onDismiss: (event: CustomEvent<ButtonProps.ClickDetail>) => {
          item.onDismiss?.(event);
          dismissNotification(item.id);
        },
      };
      setItems((prevItems) => {
        return [...prevItems, newItem];
      });
    },
    []
  );

  return (
    <NotificationsContext.Provider value={{ items, addNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
}
