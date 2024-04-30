import Header from '@cloudscape-design/components/header';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useCreateEventSubSubscription,
  useDeleteEventSubSubscription,
  useGetUsers,
  useSendChatMessage,
} from '../../api/api';
import Box from '@cloudscape-design/components/box';
import styles from './chat.module.scss';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ChatMessage from './chat-message';
import Alert from '@cloudscape-design/components/alert';
import {
  ButtonDropdown,
  ButtonDropdownProps,
  ExpandableSection,
  NonCancelableCustomEvent,
} from '@cloudscape-design/components';
import Link from '@cloudscape-design/components/link';
import Button from '@cloudscape-design/components/button';
import { connectHref } from '../home/page';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import clsx from 'clsx';
import ChatRestrictions from './chat-restrictions';
import { ChatEvent, ChatMessage as ChatMessageType, WelcomeMessage } from '../../api/twitch-types';
import Popover from '@cloudscape-design/components/popover';
import Avatar from 'common/avatar';
import useFeedback from '../../feedback/use-feedback';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpLong } from '@fortawesome/pro-solid-svg-icons';
import ChatBox from 'common/chat-box';
import { spaceScaledXs } from '@cloudscape-design/design-tokens';
import InternalLink from 'common/internal-link';
import { interpolatePathname, Pathname } from 'utilities/routes';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { flushSync } from 'react-dom';

enum SettingsId {
  Restrictions = 'restrictions',
}
let ws: WebSocket;
let isInit: boolean;

export default function Chat({ broadcasterUserId, height }: Props) {
  const [subscriptionId, setSubscriptionId] = useState<string>();
  const [chatMessage, setChatMessage] = useState<string>('');
  const [isRestrictionsModalVisible, setIsRestrictionsModalVisible] = useState<boolean>(false);
  const [isReconnectError, setIsReconnectError] = useState<boolean>(false);
  const { openFeedback } = useFeedback();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatEvent[]>([]);
  const { data: userData } = useGetUsers({});
  const user = userData?.data[0];
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [highlightedMessage, setHighlightedMessage] = useState<ChatEvent | null>(null);
  const [headerHeight, headerRef] = useContainerQuery((rect) => rect.borderBoxHeight);
  const [footerHeight, footerRef] = useContainerQuery((rect) => rect.borderBoxHeight);
  const contentHeightString = `${(height ?? 1) - 2}px`;
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
  const { mutate: deleteSubscription } = useDeleteEventSubSubscription();
  const { mutate: sendChat } = useSendChatMessage();

  useEffect(() => {
    if (isInit) {
      return;
    }
    ws = new WebSocket('wss://eventsub.wss.twitch.tv/ws');
    return () => {
      isInit = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (subscriptionId) {
        deleteSubscription({ id: subscriptionId });
      }
    };
  }, [deleteSubscription, subscriptionId]);

  useEffect(() => {
    if (!broadcasterUserId || !user?.id) {
      return;
    }

    ws.onmessage = (event) => {
      const message: WelcomeMessage | ChatMessageType = JSON.parse(event.data);
      if (message.metadata.message_type === 'session_welcome') {
        setIsReconnectError(false);
        createSubscription({
          type: 'channel.chat.message',
          version: 1,
          condition: {
            broadcaster_user_id: broadcasterUserId,
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
        let isDuplicate: boolean = false;
        let latestIsScrolled = false;
        flushSync(() => {
          setMessages((prevMessages) => {
            // Some messages can be duplicated, so don't process these again
            // https://dev.twitch.tv/docs/eventsub/#handling-duplicate-events
            isDuplicate = prevMessages.some(
              (message) => message.message_id === newMessage.message_id
            );
            // hacky way to get current value of `isScrolled` because onmessage
            // does not get reassigned when useEffect dependencies change
            // for some reason
            setIsScrolled((prev) => {
              latestIsScrolled = prev;
              return prev;
            });
            if (isDuplicate) {
              return prevMessages;
            }
            return [newMessage, ...prevMessages].slice(0, 500);
          });
        });
        if (isDuplicate) {
          return;
        }
        if (!latestIsScrolled) {
          scrollContainerRef.current?.scrollTo({
            top: scrollContainerRef.current?.scrollHeight,
            behavior: 'auto',
          });
        }
      }
    };
  }, [broadcasterUserId, user, createSubscription, subscriptionId, deleteSubscription]);

  const handleScroll = useCallback(function (this: HTMLDivElement, event: Event) {
    const isBottom = this.scrollHeight - (this.clientHeight + this.scrollTop) < 1;
    setIsScrolled(!isBottom);
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    scrollContainer?.addEventListener('scroll', handleScroll);
    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToBottom = useCallback((): void => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current?.scrollHeight,
    });
  }, []);

  const handleSendChat = useCallback(
    (message?: string): void => {
      sendChat({
        broadcaster_id: broadcasterUserId ?? '',
        message: message || chatMessage,
        sender_id: user?.id ?? '',
        reply_parent_message_id: highlightedMessage?.message_id,
      });
      setChatMessage('');
    },
    [chatMessage, sendChat, broadcasterUserId, user, highlightedMessage]
  );

  function handleItemClick(event: NonCancelableCustomEvent<ButtonDropdownProps.ItemClickDetails>) {
    const { id } = event.detail;
    if (id === SettingsId.Restrictions) {
      setIsRestrictionsModalVisible(true);
    }
  }

  // Use useCallback so child components don't re-render
  const handleChange = useCallback((value: string): void => {
    setChatMessage(value);
  }, []);

  return (
    <>
      <div style={{ position: 'relative' }}>
        <div
          ref={scrollContainerRef}
          className={styles.container}
          style={{
            height: contentHeightString,
            maxHeight: contentHeightString,
          }}
        >
          <div className={styles.header} ref={headerRef}>
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
          <div
            className={styles.body}
            style={{
              minHeight: `calc(100% - ${headerHeight}px - ${footerHeight}px - 16px)`,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
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
                      Sign in
                    </Button>
                  }
                >
                  Flux's Twitch permissions have changed. Sign in with Twitch again and reload the
                  page to enable chat.
                </Alert>
              )}
              {error && !isReconnectError && (
                <Alert type="error" header="Failed to load chat">
                  <SpaceBetween size="m">
                    <div>
                      Reload the page or try again later.{' '}
                      <Link
                        href="#"
                        onFollow={(e) => {
                          e.preventDefault();
                          openFeedback();
                        }}
                        variant="primary"
                      >
                        Send feedback
                      </Link>{' '}
                      and share more details.
                    </div>
                    <ExpandableSection headerText="Error details">
                      <div style={{ overflow: 'auto' }}>
                        <Box variant="pre">{JSON.stringify(error, null, 2)}</Box>
                      </div>
                    </ExpandableSection>
                  </SpaceBetween>
                </Alert>
              )}
              {
                !error &&
                  !isLoading &&
                  // <div className={styles.messages}>
                  messages.map((message) => (
                    <ChatMessage
                      onClick={() => setHighlightedMessage(message)}
                      message={message}
                      key={message.message_id}
                    />
                  ))
                // </div>
              }
            </div>
          </div>
          <div ref={footerRef} className={styles.footer}>
            <SpaceBetween size="s">
              {highlightedMessage && (
                <div>
                  <Box float="right">
                    <Button
                      onClick={() => setHighlightedMessage(null)}
                      variant="icon"
                      iconName="close"
                    />
                  </Box>
                  <Box variant="h5">
                    Replying to{' '}
                    <InternalLink
                      href={interpolatePathname(Pathname.Channel, {
                        login: highlightedMessage.chatter_user_login,
                      })}
                    >
                      {highlightedMessage.chatter_user_name}
                    </InternalLink>
                  </Box>
                  <ChatMessage message={highlightedMessage} variant="featured" />
                </div>
              )}
              <div style={{ display: 'flex', gap: spaceScaledXs, flexWrap: 'nowrap' }}>
                <div style={{ marginTop: '4px' }}>
                  <Avatar userId={user?.id ?? ''} size="s" />
                </div>
                <ChatBox
                  value={chatMessage}
                  onChange={handleChange}
                  onSubmit={handleSendChat}
                  placeholder={highlightedMessage ? 'Reply' : 'Chat'}
                />
                <div style={{ alignSelf: 'end' }}>
                  <Button
                    onClick={() => handleSendChat()}
                    variant="link"
                    iconSvg={<FontAwesomeIcon color="inherit" icon={faArrowUpLong} />}
                  />
                </div>
              </div>
            </SpaceBetween>
          </div>
        </div>
        <div
          className={clsx(styles.unreadBadgeWrapper, isScrolled && styles.visible)}
          style={{
            bottom: `calc(${footerHeight}px + 16px)`,
            right: `16px`,
          }}
        >
          <div className={styles.unreadBadge}>
            <Button onClick={scrollToBottom} iconName="angle-down" />
          </div>
        </div>
      </div>
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
