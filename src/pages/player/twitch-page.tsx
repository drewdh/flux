import { useCallback, useEffect, useRef, useState } from 'react';

import DhAppLayout from 'common/flux-app-layout';
import TwitchComponent from './twitch';
import ProfileDrawer from './profile-drawer';
import { useParams } from 'react-router';
import { useGetUsers } from '../../api/api';
import useLocalStorage, { LocalStorageKey } from 'utilities/use-local-storage';
import ChatDrawer from './chat-drawer';
import useChatMessages from 'common/use-chat-messages';

const viewportBreakpointXs = 688;
enum DrawerId {
  Profile = 'profile',
  Chat = 'chat',
}

export default function TwitchPage() {
  const { user } = useParams();
  const [chatSize, setChatSize] = useLocalStorage<number>(LocalStorageKey.ChatDrawerSize, 290);
  const { data: usersData } = useGetUsers({ logins: [user!] }, { enabled: !!user });
  const broadcasterId = usersData?.data[0].id ?? null;
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(DrawerId.Chat);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(broadcasterId);
  const ref = useRef<HTMLDivElement>(null);
  const [disableContentPaddings, setDisableContentPaddings] = useState<boolean>(false);
  const [hasUnread, setHasUnread] = useState<boolean>(false);

  const handleMessagesChange = useCallback(() => {
    setHasUnread(activeDrawerId !== DrawerId.Chat);
  }, [activeDrawerId]);

  const { error, isLoading, isReconnectError, messages } = useChatMessages({
    broadcasterId: broadcasterId ?? '',
    onMessagesChange: handleMessagesChange,
  });

  // Load broadcaster profile by default
  useEffect(() => {
    if (broadcasterId && !selectedUserId) {
      setSelectedUserId(broadcasterId);
    }
  }, [selectedUserId, broadcasterId]);

  useEffect(() => {
    const refCurrent = ref.current;
    if (!refCurrent) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setDisableContentPaddings(width < viewportBreakpointXs);
    });
    resizeObserver.observe(refCurrent);
    return () => resizeObserver.unobserve(refCurrent);
  }, []);

  return (
    <div ref={ref}>
      <DhAppLayout
        activeDrawerId={activeDrawerId}
        toolsHide
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
            onResize: (event) => {
              setChatSize(event.detail.size);
            },
            defaultSize: chatSize,
            resizable: true,
          },
          {
            id: DrawerId.Profile,
            content: <ProfileDrawer userId={selectedUserId} />,
            trigger: {
              iconName: 'user-profile',
            },
            ariaLabels: {
              drawerName: 'Profile details',
            },
          },
        ]}
        disableContentPaddings={disableContentPaddings}
        maxContentWidth={1700}
        onDrawerChange={(event) => {
          const nextActiveDrawerId = event.detail.activeDrawerId;
          setActiveDrawerId(nextActiveDrawerId);
          if (nextActiveDrawerId === DrawerId.Chat) {
            setHasUnread(false);
          }
        }}
        contentType="wizard"
        content={
          <TwitchComponent
            onUserIdChange={(userId) => {
              setSelectedUserId(userId);
              setActiveDrawerId(DrawerId.Profile);
            }}
          />
        }
      />
    </div>
  );
}
