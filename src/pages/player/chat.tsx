import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';
import Button from '@cloudscape-design/components/button';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import clsx from 'clsx';
import { spaceScaledXs } from '@cloudscape-design/design-tokens';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import styles from './chat.module.scss';
import ChatMessage from './chat-message';
import { connectHref } from '../home/page';
import { ChatEvent } from '../../api/twitch-types';
import Avatar from 'common/avatar';
import { useFeedback } from '../../feedback/feedback-context';
import ChatBox from 'common/chat-box';
import { useGetUsers, useSendChatMessage } from '../../api/api';

export default function Chat({
  broadcasterUserId,
  onUserIdChange,
  isReconnectError,
  messages,
  error,
  isLoading,
}: Props) {
  const [chatMessage, setChatMessage] = useState<string>('');
  const { setIsFeedbackVisible } = useFeedback();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: userData } = useGetUsers({});
  const user = userData?.data[0];
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [highlightedMessage, setHighlightedMessage] = useState<ChatEvent | null>(null);
  const [footerHeight, footerRef] = useContainerQuery((rect) => rect.borderBoxHeight);
  const { mutate: sendChat } = useSendChatMessage();

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
      setHighlightedMessage(null);
    },
    [chatMessage, sendChat, broadcasterUserId, user, highlightedMessage]
  );

  // Use useCallback so child components don't re-render
  const handleChange = useCallback((value: string): void => {
    setChatMessage(value);
  }, []);

  return (
    <>
      <div style={{ position: 'relative' }}>
        <div className={styles.container}>
          <div className={styles.body} ref={scrollContainerRef}>
            <div style={{ display: 'flex', flexDirection: 'column-reverse', padding: '5px 0' }}>
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
                          setIsFeedbackVisible(true);
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
                      onAvatarClick={(userId) => onUserIdChange(userId)}
                      onMessageClick={() => setHighlightedMessage(message)}
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
                    <Link onClick={() => onUserIdChange(highlightedMessage?.chatter_user_id)}>
                      {highlightedMessage.chatter_user_name}
                    </Link>
                  </Box>
                  <ChatMessage message={highlightedMessage} variant="featured" />
                </div>
              )}
              <div style={{ display: 'flex', gap: spaceScaledXs, flexWrap: 'nowrap' }}>
                <ChatBox
                  value={chatMessage}
                  onChange={handleChange}
                  onSubmit={handleSendChat}
                  placeholder={highlightedMessage ? 'Reply' : 'Chat'}
                />
                <div style={{ alignSelf: 'end', paddingRight: spaceScaledXs }}>
                  <Button onClick={() => handleSendChat()} variant="icon" iconName="send" />
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
    </>
  );
}

interface Props {
  onUserIdChange: (userId: string | null) => void;
  broadcasterUserId: string | undefined;
  error: Error | null;
  isLoading: boolean;
  isReconnectError: boolean;
  messages: ChatEvent[];
}
