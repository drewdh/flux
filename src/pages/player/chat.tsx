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
import ChatMessage, { ChatMessageProps } from './chat-message';
import { connectHref } from '../../constants';
import { useFeedback } from '../../feedback/feedback-context';
import ChatBox from 'common/chat-box';
import { useGetUsers, useSendChatMessage } from '../../api/api';
import { ChatMessagesState } from 'common/use-chat-messages';

const topNavHeight = '58px';
const drawerHeaderHeight = '65px';

export default function Chat({
  broadcasterUserId,
  isReconnectError,
  messages,
  error,
  isLoading,
}: Props) {
  const [chatMessage, setChatMessage] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: userData } = useGetUsers({});
  const user = userData?.data[0];
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [highlightedMessage, setHighlightedMessage] =
    useState<ChatMessagesState.ChatMessage | null>(null);
  const [footerHeight, footerRef] = useContainerQuery((rect) => rect.borderBoxHeight);
  const { mutate: sendChat } = useSendChatMessage();

  const handleScroll = useCallback(function (this: HTMLDivElement, event: Event) {
    setIsScrolled(this.scrollTop < 0);
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
        reply_parent_message_id: highlightedMessage?.data.message_id,
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
          <div
            className={styles.body}
            ref={scrollContainerRef}
            style={{
              height: `calc(100dvh - ${topNavHeight} - ${drawerHeaderHeight} - ${footerHeight}px)`,
            }}
          >
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
              {error && !isReconnectError && <Error error={error} />}
              {!error && !isLoading && (
                <Messages onMessageClick={setHighlightedMessage} messages={messages} />
              )}
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
                  <ChatMessage message={highlightedMessage.data} variant="featured" />
                </div>
              )}
              <div style={{ display: 'flex', gap: spaceScaledXs, flexWrap: 'nowrap' }}>
                <ChatBox
                  value={chatMessage}
                  onChange={handleChange}
                  onSubmit={handleSendChat}
                  placeholder={highlightedMessage ? 'Reply' : 'Chat'}
                />
                <div style={{ alignSelf: 'end' }}>
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

function Error({ error }: { error: Error }) {
  const { setIsFeedbackVisible } = useFeedback();

  return (
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
  );
}

interface MessagesProps {
  onMessageClick: (message: ChatMessagesState.ChatMessage) => void;
  messages: ChatMessagesState.Message[];
}
function Messages({ messages, onMessageClick }: MessagesProps) {
  return (
    <>
      {messages.map((message, index) => {
        if (message.type === 'info') {
          return (
            <Box variant="small" textAlign="center" padding={{ vertical: 'm' }}>
              {message.text}
            </Box>
          );
        }
        let chunkPosition: ChatMessageProps.ChunkPosition = 'none';
        const nextMessage: ChatMessagesState.Message | undefined = messages[index - 1];
        const prevMessage: ChatMessagesState.Message | undefined = messages[index + 1];
        if (
          message.data.reply ||
          prevMessage?.type === 'info' ||
          nextMessage?.type === 'info' ||
          (prevMessage?.data.reply && nextMessage?.data.reply)
        ) {
          chunkPosition = 'none';
        } else if (
          prevMessage?.data.chatter_user_id === message.data.chatter_user_id &&
          nextMessage?.data.chatter_user_id === message.data.chatter_user_id
        ) {
          chunkPosition = nextMessage?.data.reply
            ? 'last'
            : prevMessage?.data.reply
              ? 'first'
              : 'middle';
        } else if (nextMessage?.data.chatter_user_id === message.data.chatter_user_id) {
          chunkPosition = nextMessage?.data.reply ? 'none' : 'first';
        } else if (prevMessage?.data.chatter_user_id === message.data.chatter_user_id) {
          chunkPosition = prevMessage?.data.reply ? 'none' : 'last';
        }
        return (
          <ChatMessage
            onMessageClick={() => onMessageClick(message)}
            message={message.data}
            chunkPosition={chunkPosition}
            key={message.data.message_id}
          />
        );
      })}
    </>
  );
}

interface Props {
  broadcasterUserId: string | undefined;
  error: Error | null;
  isLoading: boolean;
  isReconnectError: boolean;
  messages: ChatMessagesState.Message[];
}
