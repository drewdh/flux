import Box from '@cloudscape-design/components/box';
import Icon from '@cloudscape-design/components/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBadgeCheck } from '@fortawesome/pro-solid-svg-icons';
import Link from '@cloudscape-design/components/link';

import styles from './chat.module.scss';
import Avatar from 'common/avatar';
import { useGetUsers } from '../../api/api';
import Emote from './emote';
import { ReactNode } from 'react';
import { ChatEvent } from '../../api/twitch-types';
import clsx from 'clsx';

export function Message({ message }: Props) {
  return (
    <span className={styles.message}>
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
    </span>
  );
}

export default function ChatMessage({ message, onClick, variant = 'normal' }: Props) {
  const { data: userData } = useGetUsers({
    ids: [message.chatter_user_id, message.reply?.parent_user_id ?? ''].filter(Boolean),
  });
  const user = userData?.data[0];

  return (
    <div
      onClick={onClick}
      className={clsx(styles.wrapper, variant === 'normal' && styles.clickable)}
    >
      {message.reply && variant === 'normal' && (
        <div className={styles.replyWrapper}>
          <div className={styles.replyConnector} />
          <Avatar userId={message.reply.parent_user_id} size="xs" />
          <div className={styles.replyTextWrapper}>
            @<span>{message.reply.parent_user_name}</span> {message.reply.parent_message_body}
          </div>
        </div>
      )}
      <div className={styles.messageWrapper}>
        <div className={variant === 'featured' ? styles.newReplyConnectorWrapper : styles.collapse}>
          <div className={variant === 'featured' ? styles.newReplyConnector : styles.collapse} />
          <Avatar userId={message.chatter_user_id} size="s" />
        </div>
        <div>
          {variant === 'normal' && (
            <span className={styles.username}>
              {/*<b style={{ color: message.color }}>{message.chatter_user_name}</b>*/}
              <b>{message.chatter_user_name}</b>
              {user?.broadcaster_type === 'partner' && (
                <Box variant="span" padding={{ left: 'xxs' }}>
                  <Icon svg={<FontAwesomeIcon icon={faBadgeCheck} color="#a970ff" />} />
                </Box>
              )}
            </span>
          )}
          <Message message={message} variant={variant} />
        </div>
      </div>
      {/*{variant === 'featured' && (*/}
      {/*  <div className={styles.newReplyConnectorWrapper}>*/}
      {/*    <div className={styles.newReplyConnector} />*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
}

interface Props {
  message: ChatEvent;
  onClick?: () => void;
  variant?: 'featured' | 'normal';
}
