import { useState } from 'react';
import { colorBackgroundInputDisabled } from '@cloudscape-design/design-tokens';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { generatePath, Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { Pathname } from 'utilities/routes';
import Avatar from 'common/avatar';
import styles from './styles.module.scss';
import { Stream } from '../../api/twitch-types';
import FluxImage from 'common/flux-image';

export default function VideoThumbnail({ live, stream, variant = 'normal' }: VideoThumbnailProps) {
  const navigate = useNavigate();
  const videoHref = generatePath(Pathname.Live, { user: stream.user_login });
  const viewerCount = stream.viewer_count.toLocaleString(undefined, {
    notation: 'compact',
  });
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <div
      className={clsx(styles.wrapper, isFocused && styles.focused)}
      onPointerEnter={() => setIsFocused(true)}
      onPointerLeave={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={() => navigate(videoHref)}
    >
      <Link to={videoHref} aria-hidden="true" tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        <FluxImage
          style={{
            aspectRatio: '16 / 9',
            backgroundColor: colorBackgroundInputDisabled,
            width: '100%',
            display: 'block',
          }}
          alt=""
          src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${stream.user_login}-440x248.jpg`}
        />
      </Link>
      <div className={styles.contentWrapper}>
        <div className={styles.streamer}>
          <img
            alt=""
            aria-hidden="true"
            className={styles.background}
            src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${stream.user_login}-440x248.jpg`}
          />
          {variant !== 'compact' && (
            <div className={styles.avatar}>
              <Avatar userId={stream.user_id} size="m" />
            </div>
          )}
          <div className={styles.content}>
            <Link
              to={videoHref}
              className={styles.streamTitle}
              onClick={(e) => e.stopPropagation()}
            >
              {stream.title}
            </Link>
            {/*<span className={styles.userName}>{stream.user_name}</span>*/}
            <Box variant="span" display="block" color="text-status-inactive">
              {stream.user_name}
            </Box>
            <Box variant="span" display="block" color="text-status-inactive">
              <SpaceBetween size="xxs" direction="horizontal">
                <span>{stream.game_name}</span>
                <span aria-hidden="true">&bull;</span>
                <span>{viewerCount} viewers</span>
              </SpaceBetween>
            </Box>
          </div>
        </div>
        <div className={styles.blur} />
      </div>
    </div>
  );
}

export declare namespace VideoThumbnailProps {
  type Variant = 'normal' | 'compact';
}
export interface VideoThumbnailProps {
  stream: Stream;
  live?: boolean;
  rankText?: string;
  showCategory?: boolean;
  variant?: VideoThumbnailProps.Variant;
}
