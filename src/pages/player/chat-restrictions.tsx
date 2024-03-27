import Modal from '@cloudscape-design/components/modal';
import Header from '@cloudscape-design/components/header';
import { useGetChatSettings } from '../../api/api';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import { ReactNode } from 'react';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Alert from '@cloudscape-design/components/alert';

export default function ChatRestrictions({ visible, onDismiss }: Props) {
  const { isLoading, data } = useGetChatSettings();
  const settings = data?.data?.[0];
  const hasNoRestrictions =
    !settings?.emote_mode &&
    !settings?.follower_mode &&
    !settings?.subscriber_mode &&
    !settings?.unique_chat_mode;

  return (
    <Modal
      header={
        <Header description="These restrictions are set by the broadcaster.">
          Chat restrictions
        </Header>
      }
      visible={visible}
      onDismiss={onDismiss}
    >
      {isLoading && <StatusIndicator type="loading">Loading chat restrictions</StatusIndicator>}
      {settings && (
        <SpaceBetween size="l">
          {settings.emote_mode && (
            <Alert header="Emote mode">Chat messages must contain only emotes.</Alert>
          )}
          {settings.follower_mode && (
            <Alert header="Follower mode">
              {settings.follower_mode_duration === 0 && <>Chat is restricted to followers.</>}
              {settings.follower_mode_duration !== 0 && (
                <>
                  Chat is restricted to followers who have been following for at least{' '}
                  {settings.follower_mode_duration} minutes.
                </>
              )}
            </Alert>
          )}
          {settings.slow_mode && (
            <Alert header="Slow mode">
              Users in chat may only send a message every {settings.slow_mode_wait_time} seconds.
            </Alert>
          )}
          {settings.subscriber_mode && (
            <Alert header="Subscriber mode">Chat is restricted to subscribers.</Alert>
          )}
          {settings.unique_chat_mode && (
            <Alert header="Unique message mode">Users can't post duplicate messages.</Alert>
          )}
          {hasNoRestrictions && (
            <Alert header="No restrictions" type="success">
              Any user may post in chat.
            </Alert>
          )}
        </SpaceBetween>
      )}
    </Modal>
  );
}

interface Props {
  visible: boolean;
  onDismiss: () => void;
}
