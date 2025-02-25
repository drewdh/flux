import { useCallback, useEffect, useState } from 'react';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';

import DhAppLayout from 'common/flux-app-layout';
import TwitchComponent from './twitch';
import ProfileDrawer from './profile-drawer';
import { useParams } from 'react-router';
import { useGetStreams, useGetUsers } from '../../api/api';
import useLocalStorage, { LocalStorageKey } from 'utilities/use-local-storage';
import ChatDrawer from './chat-drawer';
import useChatMessages from 'common/use-chat-messages';
import useMobile from 'utilities/use-mobile';

enum DrawerId {
  Profile = 'profile',
  Chat = 'chat',
}

export default function TwitchPage() {
  const { user } = useParams();
  const [drawerSize, setDrawerSize] = useLocalStorage<number>(LocalStorageKey.DrawerSize, 290);
  const { data: usersData } = useGetUsers({ logins: [user!] }, { enabled: !!user });
  const { data: streamsData } = useGetStreams({ userLogins: [user!] });
  const streamId = streamsData?.pages[0].data[0].id;
  const broadcasterId = usersData?.data[0].id ?? null;
  const isMobile = useMobile();
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(() => DrawerId.Chat);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(broadcasterId);
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

  // Load broadcaster profile by default
  useEffect(() => {
    if (broadcasterId && !selectedUserId) {
      setSelectedUserId(broadcasterId);
    }
  }, [selectedUserId, broadcasterId]);

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
      drawers={[
        {
          id: DrawerId.Chat,
          content: (
            <ChatDrawer
              onUserIdChange={(userId) => {
                setSelectedUserId(userId);
                setActiveDrawerId(DrawerId.Profile);
              }}
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
        {
          id: DrawerId.Profile,
          defaultSize: drawerSize,
          resizable: true,
          onResize: handleDrawerResize,
          content: <ProfileDrawer userId={selectedUserId} />,
          trigger: {
            iconName: 'user-profile',
          },
          ariaLabels: {
            drawerName: 'Profile details',
          },
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
      content={
        <TwitchComponent
          onUserIdChange={(userId) => {
            setSelectedUserId(userId);
            setActiveDrawerId(DrawerId.Profile);
          }}
        />
      }
    />
  );
}
