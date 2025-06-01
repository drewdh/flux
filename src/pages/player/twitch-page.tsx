import { useCallback, useEffect, useState } from 'react';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';

import DhAppLayout from 'common/flux-app-layout';
import TwitchComponent from './twitch';
import { useParams } from 'react-router';
import { useGetStreams, useGetUsers } from '../../api/api';
import useLocalStorage, { LocalStorageKey } from 'utilities/use-local-storage';
import ChatDrawer from './chat-drawer';
import useChatMessages from 'common/use-chat-messages';
import useMobile from 'utilities/use-mobile';

enum DrawerId {
  Chat = 'chat',
}

export default function TwitchPage() {
  const { user } = useParams();
  const [drawerSize, setDrawerSize] = useLocalStorage<number>(LocalStorageKey.ChatDrawerSize, 290);
  const { data: usersData } = useGetUsers({ logins: [user!] }, { enabled: !!user });
  const { data: streamsData } = useGetStreams({ userLogins: [user!], type: 'all' });
  const streamId = streamsData?.pages[0].data[0]?.id;
  const broadcasterId = usersData?.data[0].id ?? null;
  const isMobile = useMobile();
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(() => DrawerId.Chat);
  const [hasUnread, setHasUnread] = useState<boolean>(false);

  const handleMessagesChange = useCallback(() => {
    setHasUnread(activeDrawerId !== DrawerId.Chat);
  }, [activeDrawerId]);

  const handleDrawerResize = useCallback(
    (event: NonCancelableCustomEvent<{ size: number }>) => {
      setDrawerSize(event.detail.size);
    },
    [setDrawerSize]
  );

  const { error, isLoading, isReconnectError, messages } = useChatMessages({
    broadcasterId: broadcasterId ?? '',
    onMessagesChange: handleMessagesChange,
    streamId,
  });

  // Hide full-screen drawer on mobile
  useEffect(() => {
    if (isMobile) {
      setActiveDrawerId(null);
    }
  }, [isMobile]);

  return (
    <DhAppLayout
      activeDrawerId={activeDrawerId}
      toolsHide
      maxContentWidth={1840}
      drawers={[
        {
          id: DrawerId.Chat,
          content: (
            <ChatDrawer
              error={error}
              isReconnectError={isReconnectError}
              isLoading={isLoading}
              messages={messages}
            />
          ),
          badge: hasUnread,
          trigger: {
            iconName: 'contact',
          },
          ariaLabels: {
            drawerName: 'Chat',
          },
          onResize: handleDrawerResize,
          defaultSize: drawerSize,
          resizable: true,
        },
      ]}
      disableContentPaddings={isMobile}
      onDrawerChange={(event) => {
        const nextActiveDrawerId = event.detail.activeDrawerId;
        setActiveDrawerId(nextActiveDrawerId);
        if (nextActiveDrawerId === DrawerId.Chat) {
          setHasUnread(false);
        }
      }}
      content={<TwitchComponent />}
    />
  );
}
