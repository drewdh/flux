import { colorBackgroundInputDisabled } from '@cloudscape-design/design-tokens';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';

import { interpolatePathname, Pathname } from 'utilities/routes';
import Avatar from 'common/avatar';
import styles from './styles.module.scss';
import { Stream } from '../../api/twitch-types';
import FluxImage from 'common/flux-image';

export default function VideoThumbnail({ isLive, stream }: VideoThumbnailProps) {
  const navigate = useNavigate();
  const videoHref = interpolatePathname(Pathname.Live, { user: stream.user_login });
  const profileHref = interpolatePathname(Pathname.Profile, { login: stream.user_login });
  const viewerCount = stream.viewer_count.toLocaleString(undefined, {
    notation: 'compact',
  });

  return (
    <div className={styles.wrapper} onClick={() => navigate(videoHref)}>
      <div className={styles.mediaWrapper}>
        <Link to={videoHref} onClick={(e) => e.stopPropagation()}>
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
        </Link>
      </div>
      <div className={styles.contentWrapper}>
        <Avatar userId={stream.user_id} size="m" />
        <Box>
          <span className={styles.streamTitle}>{stream.user_name}</span>
          {/*<Link to={profileHref} onClick={(e) => e.stopPropagation()}>*/}
          {/*  <Box variant="small">{stream.user_name}</Box>*/}
          {/*</Link>*/}
          <Box variant="small" display="block">
            <SpaceBetween size="xxs" direction="horizontal">
              <span>{stream.game_name}</span>
              <span>&bull;</span>
              {viewerCount} viewers
            </SpaceBetween>
          </Box>
        </Box>
      </div>
    </div>
  );
}

export interface VideoThumbnailProps {
  stream: Stream;
  isLive?: boolean;
  rankText?: string;
  showCategory?: boolean;
}
