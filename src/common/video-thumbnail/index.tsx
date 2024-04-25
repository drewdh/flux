import { interpolatePathname, Pathname } from 'utilities/routes';
import styles from '../../pages/home/styles.module.scss';
import InternalLink from 'common/internal-link';
import {
  borderRadiusContainer,
  colorBackgroundInputDisabled,
} from '@cloudscape-design/design-tokens';
import Avatar from 'common/avatar';
import Box from '@cloudscape-design/components/box';
import { useNavigate } from 'react-router';
import { Stream } from '../../api/twitch-types';
import clsx from 'clsx';

export default function VideoThumbnail({ stream, size = 'm' }: VideoThumbnailProps) {
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
          }}
          alt={stream.title}
          src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${stream.user_login}-440x248.jpg`}
        />
      </InternalLink>
      <div className={clsx(styles.thumbnailWrapper, styles[`thumbnailWrapper-${size}`])}>
        <InternalLink href={channelHref} onFollow={(e) => e.stopPropagation()}>
          <Avatar userId={stream.user_id} />
        </InternalLink>
        <div>
          <InternalLink href={videoHref} onFollow={(e) => e.stopPropagation()}>
            <div className={clsx(styles.header, styles[`header-${size}`])}>{stream.title}</div>
          </InternalLink>
          <Box color="text-body-secondary" fontSize="body-s">
            <InternalLink
              variant="secondary"
              href={channelHref}
              onFollow={(e) => e.stopPropagation()}
            >
              {/* Display inline so anchor tag doesn't take up full width */}
              <Box color="text-body-secondary" fontSize="body-s" display="inline">
                {stream.user_name}
              </Box>
            </InternalLink>
            <div>{viewerCount} watching</div>
          </Box>
        </div>
      </div>
    </div>
  );
}

export interface VideoThumbnailProps {
  stream: Stream;
  size?: 's' | 'm';
}
