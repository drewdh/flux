import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { twitchClient, useGetUsers } from '../../api/api';
import Box from '@cloudscape-design/components/box';
import styles from './chat.module.scss';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ChatMessage from './chat-message';
import Alert from '@cloudscape-design/components/alert';
import {
  Badge,
  ButtonDropdown,
  ButtonDropdownProps,
  ExpandableSection,
  NonCancelableCustomEvent,
} from '@cloudscape-design/components';
import Link from '@cloudscape-design/components/link';
import Button from '@cloudscape-design/components/button';
import { connectHref } from '../home/page';
import Feedback from '../../feedback/feedback';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import clsx from 'clsx';
import ChatRestrictions from './chat-restrictions';
import {
  CreateEventSubSubscriptionResponse,
  DeleteEventSubSubscriptionResponse,
  WelcomeMessage,
  ChatMessage as ChatMessageType,
  Fragment,
  ChatEvent,
} from '../../api/twitch-types';
import Popover from '@cloudscape-design/components/popover';
import Input from '@cloudscape-design/components/input';
import FormField from '@cloudscape-design/components/form-field';
import Avatar from 'common/avatar/avatar';
import FormikInput from 'common/formik/input';
import { useFormik } from 'formik';
import { spaceScaledXs } from '@cloudscape-design/design-tokens';

interface SubscribeRequest {
  sessionId: string;
  broadcasterUserId: string;
  userId: string;
}
async function subscribe(request: SubscribeRequest): Promise<CreateEventSubSubscriptionResponse> {
  const requestBody = {
    type: 'channel.chat.message',
    version: 1,
    condition: {
      broadcaster_user_id: request.broadcasterUserId,
      user_id: request.userId,
    },
    transport: {
      method: 'websocket',
      session_id: request.sessionId,
    },
  };
  return twitchClient.createEventSubSubscription(requestBody);
}
function deleteSubscription(subscriptionId: string): Promise<DeleteEventSubSubscriptionResponse> {
  return twitchClient.deleteEventSubSubscription({ id: subscriptionId });
}

enum SettingsId {
  Restrictions = 'restrictions',
}

export default function Chat({ broadcasterUserId, height }: Props) {
  const [chatMessage, setChatMessage] = useState<string>('');
  const [isRestrictionsModalVisible, setIsRestrictionsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReconnectError, setIsReconnectError] = useState<boolean>(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState<boolean>(false);
  const [error, setError] = useState<object | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatEvent[]>([]);
  const { data: userData } = useGetUsers({});
  const user = userData?.data[0];
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [highlightedMessage, setHighlightedMessage] = useState<ChatEvent | null>(null);
  // subtract border (1px + 1px), container heading height (53px), and content padding (4px top, 8px bottom), and 84px footer
  const heightString = `${(height ?? 1) - 156}px`;

  useEffect(() => {
    if (!broadcasterUserId || !user?.id) {
      return;
    }
    let subscriptionId: string;
    const ws = new WebSocket('wss://eventsub.wss.twitch.tv/ws');
    ws.onopen = function (event) {
      console.log(event);
    };

    ws.onmessage = function (event) {
      const message: WelcomeMessage | ChatMessageType = JSON.parse(event.data);
      if (message.metadata.message_type === 'session_welcome') {
        setError(null);
        setIsReconnectError(false);
        subscribe({
          sessionId: (message as WelcomeMessage).payload.session.id,
          broadcasterUserId,
          userId: user.id,
        })
          .then((resp) => (subscriptionId = resp.data[0].id))
          .catch((error) => {
            if (error.message === 'subscription missing proper authorization') {
              setIsReconnectError(true);
            } else {
              setError(error);
            }
          })
          .finally(() => setIsLoading(false));
        return;
      }
      if (message.metadata.message_type === 'notification') {
        const { event: newMessage } = (message as ChatMessageType).payload;
        // console.log(event);
        // const newMessage: SimpleMessage = {
        //   color: event.color,
        //   fragments: event.message.fragments,
        //   message_id: event.message_id,
        //   message_text: event.message.text,
        //   chatter_user_id: event.chatter_user_id,
        //   chatter_user_name: event.chatter_user_name,
        //   subscriber_month_count: event.badges.find((badge) => badge.set_id === 'subscriber')?.info,
        // };
        setMessages((prevMessages) => {
          // Some messages can be duplicated, so don't process these again
          // https://dev.twitch.tv/docs/eventsub/#handling-duplicate-events
          const wasProcessed = prevMessages.some(
            (message) => message.message_id === newMessage.message_id
          );
          if (wasProcessed) {
            return prevMessages;
          }
          if (isScrolled) {
            setUnreadCount((prev) => prev + 1);
          }
          return [newMessage, ...prevMessages].slice(0, 500);
        });
      }
    };

    return () => {
      ws.close();
      subscriptionId && deleteSubscription(subscriptionId);
    };
  }, [broadcasterUserId, user?.id, isScrolled]);

  const handleScroll = useCallback(function (this: HTMLDivElement, event: Event) {
    const isBottom = this.scrollTop >= 0;
    setIsScrolled(!isBottom);
    if (isBottom) {
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    scrollContainer?.addEventListener('scroll', handleScroll);
    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToBottom = useCallback((): void => {
    setUnreadCount(0);
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  function handleItemClick(event: NonCancelableCustomEvent<ButtonDropdownProps.ItemClickDetails>) {
    const { id } = event.detail;
    if (id === SettingsId.Restrictions) {
      setIsRestrictionsModalVisible(true);
    }
  }

  return (
    <>
      <Container
        disableHeaderPaddings
        disableContentPaddings
        footer={
          <SpaceBetween size="m">
            {highlightedMessage && (
              <ChatMessage
                message={highlightedMessage}
                onHide={() => setHighlightedMessage(null)}
                variant="featured"
              />
            )}
            {/*<FormField*/}
            {/*  label={*/}
            {/*    highlightedMessage ? `Reply to ${highlightedMessage.chatter_user_name}` : 'Chat'*/}
            {/*  }*/}
            {/*>*/}
            {/*  <div style={{ display: 'flex', alignItems: 'center', gap: spaceScaledXs }}>*/}
            {/*    <Avatar userId={user?.id ?? ''} />*/}
            {/*    <div style={{ width: '100%' }}>*/}
            {/*      <Input*/}
            {/*        ariaLabel="Message"*/}
            {/*        onChange={(e) => setChatMessage(e.detail.value)}*/}
            {/*        value={chatMessage}*/}
            {/*        placeholder={highlightedMessage ? 'Reply...' : 'Chat...'}*/}
            {/*      />*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</FormField>*/}
          </SpaceBetween>
        }
        header={
          <div className={styles.chatHeader}>
            <Header
              variant="h2"
              info={
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
              }
              actions={
                <ButtonDropdown
                  onItemClick={handleItemClick}
                  expandableGroups
                  items={[{ text: 'View restrictions', id: SettingsId.Restrictions }]}
                  variant="icon"
                />
              }
            >
              Chat
            </Header>
          </div>
        }
      >
        <div className={styles.containerBody}>
          <div
            className={clsx(styles.unreadBadge, unreadCount > 0 && isScrolled && styles.visible)}
          >
            <Button onClick={scrollToBottom} iconName="angle-down">
              {unreadCount} new message{unreadCount === 1 ? '' : 's'}
            </Button>
          </div>
          <div
            className={styles.chatContainer}
            ref={scrollContainerRef}
            style={{
              height: heightString,
              maxHeight: heightString,
            }}
          >
            {isLoading && (
              <div className={styles.statusContainer}>
                <StatusIndicator type="loading">Loading chat</StatusIndicator>
              </div>
            )}
            {!isLoading && !error && !isReconnectError && !messages.length && (
              <div className={clsx(styles.statusContainer, styles.empty)}>
                <b>No new messages</b>
              </div>
            )}
            {isReconnectError && (
              <Alert
                header="Chat not enabled"
                action={
                  <Button
                    onClick={() => localStorage.setItem('access_token', '')}
                    href={connectHref}
                    iconName="external"
                    iconAlign="right"
                    target="_blank"
                  >
                    Reconnect
                  </Button>
                }
              >
                Flux's Twitch permissions have changed. Reconnect to Twitch and reload the page to
                enable chat.
              </Alert>
            )}
            {error && (
              <Alert type="error" header="Failed to load chat">
                <SpaceBetween size="m">
                  <div>
                    Reload the page or try again later.{' '}
                    <Link
                      href="#"
                      onFollow={(e) => {
                        e.preventDefault();
                        setIsFeedbackVisible(true);
                      }}
                      variant="primary"
                      color="inverted"
                    >
                      Send feedback
                    </Link>{' '}
                    and share more details.
                  </div>
                  <ExpandableSection headerText="Error details">
                    <Box variant="pre">{JSON.stringify(error, null, 2)}</Box>
                  </ExpandableSection>
                </SpaceBetween>
              </Alert>
            )}
            {!error && !isLoading && (
              <div className={styles.messages}>
                {messages.map((message) => (
                  <ChatMessage
                    onClick={() => setHighlightedMessage(message)}
                    message={message}
                    key={message.message_id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
      <Feedback visible={isFeedbackVisible} onDismiss={() => setIsFeedbackVisible(false)} />
      <ChatRestrictions
        visible={isRestrictionsModalVisible}
        onDismiss={() => setIsRestrictionsModalVisible(false)}
      />
    </>
  );
}

interface Props {
  broadcasterUserId: string | undefined;
  height: number | undefined;
}
