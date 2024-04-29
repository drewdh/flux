import {
  borderRadiusContainer,
  colorBackgroundInputDisabled,
} from '@cloudscape-design/design-tokens';
import Box from '@cloudscape-design/components/box';
import { useNavigate } from 'react-router';

import { interpolatePathname, Pathname } from 'utilities/routes';
import Avatar from 'common/avatar';
import InternalLink from 'common/internal-link';
import styles from '../../pages/home/styles.module.scss';
import { Stream } from '../../api/twitch-types';

export default function VideoThumbnail({ stream, showCategory = false }: VideoThumbnailProps) {
  const navigate = useNavigate();
  const videoHref = interpolatePathname(Pathname.Live, { user: stream.user_login });
  const viewerCount = stream.viewer_count.toLocaleString(undefined, {
    notation: 'compact',
  });
  const channelHref = interpolatePathname(Pathname.Channel, {
    login: stream.user_login,
  });

  return (
    <div onClick={() => navigate(videoHref)} className={styles.cardWrapper} key={stream.user_id}>
      <InternalLink href={videoHref} onFollow={(e) => e.stopPropagation()}>
        <img
          style={{
            aspectRatio: '16 / 9',
            backgroundColor: colorBackgroundInputDisabled,
            borderRadius: borderRadiusContainer,
            width: '100%',
            display: 'block',
          }}
          alt={stream.title}
          src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${stream.user_login}-440x248.jpg`}
        />
      </InternalLink>
      <div className={styles.thumbnailWrapper}>
        <Box display="inline">
          <InternalLink
            variant="secondary"
            href={channelHref}
            onFollow={(e) => e.stopPropagation()}
          >
            <Avatar userId={stream.user_id} size="xs" />
            <span className={styles.username}>{stream.user_name}</span>
          </InternalLink>
        </Box>
        <InternalLink href={videoHref} onFollow={(e) => e.stopPropagation()}>
          <div title={stream.title} className={styles.streamTitle}>
            {stream.title || '-'}
          </div>
        </InternalLink>
        <Box color="text-body-secondary" fontSize="body-s" fontWeight="heavy">
          <span>{viewerCount} watching</span>
          {showCategory && (
            <>
              <Box
                display="inline"
                fontSize="body-s"
                color="text-status-inactive"
                margin={{ horizontal: 'xxs' }}
              >
                &bull;
              </Box>
              <InternalLink
                onFollow={(e) => e.stopPropagation()}
                href={interpolatePathname(Pathname.Game, { gameId: stream.game_id })}
              >
                <Box
                  display="inline"
                  color="text-body-secondary"
                  fontSize="body-s"
                  fontWeight="heavy"
                >
                  {stream.game_name}
                </Box>
              </InternalLink>
            </>
          )}
        </Box>
      </div>
    </div>
  );
}

export interface VideoThumbnailProps {
  stream: Stream;
  showCategory?: boolean;
}
