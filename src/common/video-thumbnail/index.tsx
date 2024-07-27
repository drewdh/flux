import {
  colorBackgroundInputDisabled,
  spaceScaledXs,
  spaceScaledXxs,
} from '@cloudscape-design/design-tokens';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Icon from '@cloudscape-design/components/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/pro-solid-svg-icons';

import { interpolatePathname, Pathname } from 'utilities/routes';
import Avatar from 'common/avatar';
import InternalLink from 'common/internal-link';
import styles from './styles.module.scss';
import { Stream } from '../../api/twitch-types';
import FluxImage from 'common/flux-image';
import { Link } from 'react-router-dom';

export default function VideoThumbnail({ isLive, stream }: VideoThumbnailProps) {
  const videoHref = interpolatePathname(Pathname.Live, { user: stream.user_login });
  const viewerCount = stream.viewer_count.toLocaleString(undefined, {
    notation: 'compact',
  });

  return (
    <Link to={videoHref} key={stream.user_id}>
      <div className={styles.wrapper}>
        <div className={styles.mediaWrapper}>
          <FluxImage
            isLive={isLive}
            style={{
              aspectRatio: '16 / 9',
              backgroundColor: colorBackgroundInputDisabled,
              width: '100%',
              display: 'block',
            }}
            alt={stream.title}
            src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${stream.user_login}-440x248.jpg`}
          />
        </div>
        <div className={styles.contentWrapper}>
          <SpaceBetween direction="vertical" size="xxs">
            <SpaceBetween direction="vertical" size="xxs">
              <div className={styles.headerWrapper}>
                <InternalLink
                  href={interpolatePathname(Pathname.Channel, { login: stream.user_login })}
                >
                  <Avatar userId={stream.user_id} size="m" />
                </InternalLink>
                <div>
                  <InternalLink
                    href={interpolatePathname(Pathname.Channel, { login: stream.user_login })}
                  >
                    <Box fontWeight="bold" color="text-body-secondary">
                      {stream.user_name}
                    </Box>
                  </InternalLink>
                  <InternalLink
                    href={interpolatePathname(Pathname.Game, { gameId: stream.game_id })}
                  >
                    <Box variant="small" display="block">
                      {stream.game_name}
                    </Box>
                  </InternalLink>
                </div>
                <div className={styles.viewerCountWrapper}>
                  <div className={styles.viewerCount}>
                    <Icon svg={<FontAwesomeIcon icon={faUserGroup} />} variant="subtle" />
                    {viewerCount}
                  </div>
                </div>
              </div>
            </SpaceBetween>
            <InternalLink href={videoHref}>
              <Box variant="h5" color="inherit">
                <span className={styles.streamTitle}>{stream.title}</span>
              </Box>
            </InternalLink>
          </SpaceBetween>
        </div>
      </div>
    </Link>
  );
}

export interface VideoThumbnailProps {
  stream: Stream;
  isLive?: boolean;
  rankText?: string;
  showCategory?: boolean;
}
