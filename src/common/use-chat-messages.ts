import { useEffect, useState } from 'react';

import { ChatEvent, ChatMessage as ChatMessageType, WelcomeMessage } from '../api/twitch-types';
import {
  useCreateEventSubSubscription,
  useDeleteEventSubSubscription,
  useGetUsers,
} from '../api/api';

export default function useChatMessages({ broadcasterId, onMessagesChange }: Props): State {
  const [subscriptionId, setSubscriptionId] = useState<string>();
  const [messages, setMessages] = useState<ChatEvent[]>([]);
  const [isReconnectError, setIsReconnectError] = useState<boolean>(false);
  const { mutate: deleteSubscription } = useDeleteEventSubSubscription();
  const { data: userData } = useGetUsers({});
  const user = userData?.data[0];

  const {
    mutate: createSubscription,
    isPending: isLoading,
    error,
  } = useCreateEventSubSubscription({
    onSuccess: (result) => setSubscriptionId(result.data[0].id),
    onError: (error) => {
      if (error.message === 'subscription missing proper authorization') {
        setIsReconnectError(true);
      }
    },
  });

  useEffect(() => {
    return () => {
      if (subscriptionId) {
        deleteSubscription({ id: subscriptionId });
      }
    };
  }, [deleteSubscription, subscriptionId]);

  useEffect(() => {
    if (!broadcasterId || !user?.id) {
      return;
    }
    const ws = new WebSocket('wss://eventsub.wss.twitch.tv/ws');

    ws.onclose = (event) => {
      console.warn(event);
    };
    ws.onmessage = (event) => {
      const message: WelcomeMessage | ChatMessageType = JSON.parse(event.data);
      if (message.metadata.message_type === 'session_welcome') {
        setIsReconnectError(false);
        createSubscription({
          type: 'channel.chat.message',
          version: 1,
          condition: {
            broadcaster_user_id: broadcasterId,
            user_id: user.id,
          },
          transport: {
            method: 'websocket',
            session_id: (message as WelcomeMessage).payload.session.id,
          },
        });
        return;
      }
      if (message.metadata.message_type === 'notification') {
        const { event: newMessage } = (message as ChatMessageType).payload;
        setMessages((prevMessages) => {
          // Some messages can be duplicated, so don't process these again
          // https://dev.twitch.tv/docs/eventsub/#handling-duplicate-events
          const isDuplicate = prevMessages.some(
            (message) => message.message_id === newMessage.message_id
          );
          if (isDuplicate) {
            return prevMessages;
          }
          onMessagesChange?.();
          // Twitch limits chat to roughly 200 messages
          return [newMessage, ...prevMessages].slice(0, 200);
        });
      }
    };
    return () => ws.close();
  }, [broadcasterId, user, createSubscription, onMessagesChange]);

  return {
    error,
    isLoading: !messages.length && isLoading,
    isReconnectError,
    messages,
  };
}

interface State {
  error: Error | null;
  isLoading: boolean;
  isReconnectError: boolean;
  messages: ChatEvent[];
}

interface Props {
  broadcasterId: string;
  onMessagesChange?: () => void;
}
