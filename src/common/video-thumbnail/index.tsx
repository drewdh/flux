import { colorBackgroundInputDisabled } from '@cloudscape-design/design-tokens';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';

import { interpolatePathname, Pathname } from 'utilities/routes';
import Avatar from 'common/avatar';
import styles from './styles.module.scss';
import { Stream } from '../../api/twitch-types';
import FluxImage from 'common/flux-image';

enum DropdownItemId {
  Category = 'category',
  Profile = 'profile',
}

export default function VideoThumbnail({ isLive, stream }: VideoThumbnailProps) {
  const navigate = useNavigate();
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
          <Avatar userId={stream.user_id} size="m" />
          <Box>
            <span className={styles.streamTitle}>{stream.title}</span>
            <Box variant="small">{stream.user_name}</Box>
            <Box variant="small" display="block">
              <SpaceBetween size="xxs" direction="horizontal">
                <span>{stream.game_name}</span>
                <span>&bull;</span>
                {viewerCount} viewers
              </SpaceBetween>
            </Box>
          </Box>
          <div className={styles.ellipsisWrapper}>
            <ButtonDropdown
              onItemFollow={(e) => {
                e.preventDefault();
                navigate(e.detail.href!);
              }}
              items={[
                {
                  href: interpolatePathname(Pathname.Game, { gameId: stream.game_id }),
                  text: 'Go to category',
                  id: DropdownItemId.Category,
                },
                {
                  href: interpolatePathname(Pathname.Profile, { login: stream.user_login }),
                  text: 'Go to profile',
                  id: DropdownItemId.Profile,
                },
              ]}
              variant="icon"
            />
          </div>
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
