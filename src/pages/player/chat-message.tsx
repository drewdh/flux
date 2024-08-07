import { ReactNode } from 'react';
import Link from '@cloudscape-design/components/link';
import clsx from 'clsx';
import { spaceScaledXs } from '@cloudscape-design/design-tokens';

import styles from './chat.module.scss';
import Avatar from 'common/avatar';
import Emote from './emote';
import { ChatEvent } from '../../api/twitch-types';

function Message({ message, onMessageClick }: Props) {
  return (
    <div className={clsx(styles.message, styles.clickable)} onClick={onMessageClick}>
      {message.message.fragments?.map((fragment, index) => {
        if (fragment.type === 'mention' && message.reply) {
          return '';
        }
        if (fragment.type === 'emote') {
          return <Emote key={index} emote={fragment.emote} />;
        }
        return (
          <span key={index}>
            {/* TODO: Make this more readable */}
            {/* Make URLs into Links */}
            {fragment.text.split(' ').map((string) => {
              const shouldTrimStart = message.reply && index === 1;
              let finalString: ReactNode = shouldTrimStart ? string : string;
              if (string.startsWith('https://')) {
                finalString = (
                  <Link
                    onFollow={(e) => e.stopPropagation()}
                    rel="noreferrer"
                    href={string}
                    variant="primary"
                    target="_blank"
                  >
                    {string}
                  </Link>
                );
              }
              return <>{finalString} </>;
            })}
          </span>
        );
      })}
    </div>
  );
}

export default function ChatMessage({
  chunkPosition = 'none',
  message,
  onMessageClick,
  onAvatarClick,
  variant = 'normal',
}: Props) {
  return (
    <div className={clsx(styles.wrapper, styles[`chunk-position-${chunkPosition}`])}>
      {message.reply && variant === 'normal' && (
        <div className={styles.replyWrapper}>
          <div className={styles.replyAvatar}>
            <Avatar userId={message.reply.parent_user_id} size="xs" />
          </div>
          {/*<div className={styles.replyConnector} />*/}
          <div className={styles.replyTextWrapper}>
            {/*@<span>{message.reply.parent_user_name}</span>*/}
            {message.reply.parent_message_body}
          </div>
        </div>
      )}
      <div className={styles.messageWrapper}>
        <div className={message.reply ? styles.newReplyConnectorWrapper : styles.collapse}>
          <div className={message.reply ? styles.newReplyConnector : styles.collapse} />
          {variant === 'featured' && <Avatar userId={message.chatter_user_id} size="s" />}
        </div>
        <div
          style={{
            display: 'flex',
            columnGap: spaceScaledXs,
            flexWrap: 'nowrap',
            alignItems: 'end',
          }}
        >
          {(chunkPosition === 'first' || chunkPosition === 'middle') && (
            <div style={{ minWidth: '28px' }}>&nbsp;</div>
          )}
          {variant === 'normal' && (chunkPosition === 'last' || chunkPosition === 'none') && (
            <div
              className={styles.clickable}
              onClick={() => onAvatarClick?.(message.chatter_user_id)}
            >
              <Avatar userId={message.chatter_user_id} size="s" />
            </div>
          )}
          {/*<b style={{ color: message.color }}>{message.chatter_user_name}</b>*/}
          {/*{user?.broadcaster_type === 'partner' && (*/}
          {/*  <Box variant="span" padding={{ left: 'xxs' }}>*/}
          {/*    <Icon svg={<FontAwesomeIcon icon={faBadgeCheck} color="#a970ff" />} />*/}
          {/*  </Box>*/}
          {/*)}*/}
          <div>
            {(chunkPosition === 'first' || chunkPosition === 'none') && (
              <div className={styles.chatterName}>{message.chatter_user_name}</div>
            )}
            <Message
              chunkPosition={chunkPosition}
              onMessageClick={onMessageClick}
              message={message}
              variant={variant}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export declare namespace ChatMessageProps {
  type ChunkPosition = 'first' | 'middle' | 'last' | 'none';
  type Variant = 'featured' | 'normal';
}

interface Props {
  chunkPosition?: ChatMessageProps.ChunkPosition;
  message: ChatEvent;
  onAvatarClick?: (userId: string) => void;
  onMessageClick?: () => void;
  variant?: ChatMessageProps.Variant;
}
