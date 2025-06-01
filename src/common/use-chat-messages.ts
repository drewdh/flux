import { useEffect, useState } from 'react';

import {
  ChatEvent,
  ChatMessage,
  ChatMessage as ChatMessageType,
  WelcomeMessage,
} from '../api/twitch-types';
import {
  useCreateEventSubSubscription,
  useDeleteEventSubSubscription,
  useGetUsers,
} from '../api/api';
import { useLocalStorage, useSessionStorage } from 'usehooks-ts';
import { LocalStorageKey } from 'utilities/local-storage-keys';

export enum EventSubStatus {
  Connected = 'connected',
  Closed = 'closed',
  Error = 'error',
}
export default function useChatMessages({
  broadcasterId,
  onMessagesChange,
  streamId,
}: Props): ChatMessagesState {
  const storageKey = `chat-${streamId}`;
  const [subscriptionId, setSubscriptionId] = useState<string>();
  const [messages, setMessages] = useState<ChatMessagesState.Message[]>([]);
  const [isReconnectError, setIsReconnectError] = useState<boolean>(false);
  const { mutate: deleteSubscription } = useDeleteEventSubSubscription();
  const { data: userData } = useGetUsers({});
  const [, setConnectionStatus] = useSessionStorage<EventSubStatus>(
    LocalStorageKey.EventSubStatus,
    EventSubStatus.Closed
  );
  const user = userData?.data[0];

  useEffect(() => {
    const prevMessagesRaw = sessionStorage.getItem(storageKey);
    try {
      const prevMessages = prevMessagesRaw && JSON.parse(prevMessagesRaw);
      if (!Array.isArray(prevMessages)) {
        return;
      }
      if (!prevMessages.length) {
        return setMessages(prevMessages);
      }
      // Add welcome message
      setMessages([
        {
          type: 'info',
          text: "Stream rejoined. Flux can't access messages sent while you're away.",
        },
        ...prevMessages,
      ]);
    } catch (_e) {}
  }, [storageKey]);

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

    ws.onopen = () => {
      setConnectionStatus(EventSubStatus.Connected);
    };
    ws.onerror = () => {
      setConnectionStatus(EventSubStatus.Error);
    };
    ws.onclose = (event) => {
      console.warn(event);
      setConnectionStatus(EventSubStatus.Closed);
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
            (message) =>
              message.type === 'message' && message.data.message_id === newMessage.message_id
          );
          if (isDuplicate) {
            return prevMessages;
          }
          onMessagesChange?.();
          // Twitch limits chat to roughly 200 messages
          const next = [
            { type: 'message', data: newMessage } as ChatMessagesState.ChatMessage,
            ...prevMessages,
          ].slice(0, 200);
          sessionStorage.setItem(storageKey, JSON.stringify(next));
          return next;
        });
      }
    };
    return () => ws.close();
  }, [broadcasterId, user, createSubscription, onMessagesChange, storageKey]);

  return {
    error,
    isLoading: !messages.length && isLoading,
    isReconnectError,
    messages,
  };
}

export declare module ChatMessagesState {
  interface ChatMessage {
    type: 'message';
    data: ChatEvent;
  }
  interface InfoMessage {
    type: 'info';
    text: string;
  }
  type Message = ChatMessage | InfoMessage;
}

export interface ChatMessagesState {
  error: Error | null;
  isLoading: boolean;
  isReconnectError: boolean;
  messages: ChatMessagesState.Message[];
}

interface Props {
  broadcasterId: string;
  onMessagesChange?: () => void;
  streamId?: string;
}
