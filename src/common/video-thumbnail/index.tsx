import { colorBackgroundInputDisabled } from '@cloudscape-design/design-tokens';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Link } from 'react-router-dom';

import { interpolatePathname, Pathname } from 'utilities/routes';
import Avatar from 'common/avatar';
import styles from './styles.module.scss';
import { Stream } from '../../api/twitch-types';
import FluxImage from 'common/flux-image';

export default function VideoThumbnail({ live, stream, variant = 'normal' }: VideoThumbnailProps) {
  const videoHref = interpolatePathname(Pathname.Live, { user: stream.user_login });
  const viewerCount = stream.viewer_count.toLocaleString(undefined, {
    notation: 'compact',
  });

  return (
    <Link to={videoHref} className={styles.wrapper}>
      <FluxImage
        style={{
          aspectRatio: '16 / 9',
          backgroundColor: colorBackgroundInputDisabled,
          width: '100%',
          display: 'block',
        }}
        alt={stream.title}
        src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${stream.user_login}-440x248.jpg`}
      />
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
            <div className={styles.streamTitle}>{stream.title}</div>
            {/*<span className={styles.userName}>{stream.user_name}</span>*/}
            <Box variant="span" display="block" color="text-status-inactive">
              {stream.user_name}
            </Box>
            <Box variant="span" display="block" color="text-status-inactive">
              <SpaceBetween size="xxs" direction="horizontal">
                <span>{stream.game_name}</span>
                <span>&bull;</span>
                <span>{viewerCount} viewers</span>
              </SpaceBetween>
            </Box>
          </div>
        </div>
        <div className={styles.blur} />
      </div>
    </Link>
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
