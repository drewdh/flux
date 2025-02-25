import Drawer from '@cloudscape-design/components/drawer';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import Box from '@cloudscape-design/components/box';
import Popover from '@cloudscape-design/components/popover';
import SpaceBetween from '@cloudscape-design/components/space-between';

import Chat from './chat';
import { useGetUsers } from '../../api/api';
import { ChatEvent } from '../../api/twitch-types';
import ChatRestrictions from './chat-restrictions';
import { ChatMessagesState } from 'common/use-chat-messages';

// enum SettingsId {
//   Restrictions = 'restrictions',
// }

export default function ChatDrawer({
  error,
  isLoading,
  isReconnectError,
  messages,
  onUserIdChange,
}: Props) {
  const { user } = useParams();
  const { data: usersData } = useGetUsers({ logins: [user!] }, { enabled: !!user });
  const broadcasterId = usersData?.data[0].id;
  const [isRestrictionsModalVisible, setIsRestrictionsModalVisible] = useState<boolean>(false);

  // function handleItemClick(event: NonCancelableCustomEvent<ButtonDropdownProps.ItemClickDetails>) {
  //   const { id } = event.detail;
  //   if (id === SettingsId.Restrictions) {
  //     setIsRestrictionsModalVisible(true);
  //   }
  // }

  return (
    <>
      <Drawer
        header={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              // borderRight: `1px solid ${colorBorderDividerDefault}`,
            }}
          >
            <SpaceBetween size="xs" direction="horizontal">
              <h2>Chat</h2>
              <Box color="text-status-info" display="inline">
                <Popover
                  header="Beta feature"
                  size="medium"
                  triggerType="text"
                  content="Chat is in beta. Some functionality may not work as expected."
                  renderWithPortal
                >
                  <Box color="text-status-info" fontSize="body-s" fontWeight="bold">
                    Beta
                  </Box>
                </Popover>
              </Box>
            </SpaceBetween>
            {/*<ButtonDropdown*/}
            {/*  onItemClick={handleItemClick}*/}
            {/*  expandableGroups*/}
            {/*  items={[{ text: 'View restrictions', id: SettingsId.Restrictions }]}*/}
            {/*  variant="icon"*/}
            {/*/>*/}
          </div>
        }
      >
        <Chat
          onUserIdChange={onUserIdChange}
          broadcasterUserId={broadcasterId}
          error={error}
          isLoading={isLoading}
          isReconnectError={isReconnectError}
          messages={messages}
        />
      </Drawer>
      <ChatRestrictions
        visible={isRestrictionsModalVisible}
        onDismiss={() => setIsRestrictionsModalVisible(false)}
      />
    </>
  );
}

interface Props {
  error: Error | null;
  isLoading: boolean;
  isReconnectError: boolean;
  onUserIdChange: (userId: string | null) => void;
  messages: ChatMessagesState.Message[];
}
