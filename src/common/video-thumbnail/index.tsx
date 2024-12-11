import { colorBackgroundInputDisabled } from '@cloudscape-design/design-tokens';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Link } from 'react-router-dom';

import { interpolatePathname, Pathname } from 'utilities/routes';
import Avatar from 'common/avatar';
import styles from './styles.module.scss';
import { Stream } from '../../api/twitch-types';
import FluxImage from 'common/flux-image';

export default function VideoThumbnail({ isLive, stream }: VideoThumbnailProps) {
  const videoHref = interpolatePathname(Pathname.Live, { user: stream.user_login });
  const viewerCount = stream.viewer_count.toLocaleString(undefined, {
    notation: 'compact',
  });

  return (
    <div className={styles.wrapper}>
      <Link to={videoHref}>
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
          <Avatar userId={stream.user_id} size="m" />
          <Box>
            <span className={styles.streamTitle}>{stream.user_name}</span>
            <Box variant="small" display="block">
              <SpaceBetween size="xxs" direction="horizontal">
                <span>{stream.game_name}</span>
                <span>&bull;</span>
                {viewerCount} viewers
              </SpaceBetween>
            </Box>
          </Box>
        </div>
      </Link>
    </div>
  );
}

export interface VideoThumbnailProps {
  stream: Stream;
  isLive?: boolean;
  rankText?: string;
  showCategory?: boolean;
}
