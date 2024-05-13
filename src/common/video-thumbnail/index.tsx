import {
  colorBackgroundInputDisabled,
  spaceScaledXs,
  spaceScaledXxs,
} from '@cloudscape-design/design-tokens';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Icon from '@cloudscape-design/components/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/pro-solid-svg-icons';

import { interpolatePathname, Pathname } from 'utilities/routes';
import Avatar from 'common/avatar';
import InternalLink from 'common/internal-link';
import styles from './styles.module.scss';
import { Stream } from '../../api/twitch-types';

export default function VideoThumbnail({
  stream,
  showCategory = false,
  rankText,
}: VideoThumbnailProps) {
  // const navigate = useNavigate();
  const videoHref = interpolatePathname(Pathname.Live, { user: stream.user_login });
  const viewerCount = stream.viewer_count.toLocaleString(undefined, {
    notation: 'compact',
  });
  // const channelHref = interpolatePathname(Pathname.Channel, {
  //   login: stream.user_login,
  // });

  return (
    <Container
      key={stream.user_id}
      media={{
        content: (
          <InternalLink href={videoHref}>
            <img
              style={{
                aspectRatio: '16 / 9',
                backgroundColor: colorBackgroundInputDisabled,
                width: '100%',
                display: 'block',
              }}
              alt={stream.title}
              src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${stream.user_login}-440x248.jpg`}
            />
          </InternalLink>
        ),
      }}
    >
      <SpaceBetween direction="vertical" size="xxs">
        <SpaceBetween direction="vertical" size="xxs">
          <div
            style={{
              display: 'flex',
              columnGap: spaceScaledXs,
            }}
          >
            <Avatar userId={stream.user_id} size="m" />
            <div>
              <Box fontWeight="bold" color="text-body-secondary">
                {stream.user_name}
              </Box>
              <Box variant="small" display="block">
                {stream.game_name}
              </Box>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Box variant="small">
                <div style={{ display: 'flex', alignItems: 'center', columnGap: spaceScaledXxs }}>
                  <Icon svg={<FontAwesomeIcon icon={faUserGroup} />} variant="subtle" />
                  {viewerCount}
                </div>
              </Box>
            </div>
          </div>
        </SpaceBetween>
        <Box variant="h4">
          <InternalLink href={videoHref} fontSize="heading-xs" variant="secondary">
            <span className={styles.streamTitle}>{stream.title}</span>
          </InternalLink>
        </Box>
      </SpaceBetween>
    </Container>
  );
}

export interface VideoThumbnailProps {
  stream: Stream;
  rankText?: string;
  showCategory?: boolean;
}
