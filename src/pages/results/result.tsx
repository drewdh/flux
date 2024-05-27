import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Avatar from 'common/avatar';
import InternalLink from 'common/internal-link';
import Icon from '@cloudscape-design/components/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBadgeCheck, faSignalStream } from '@fortawesome/pro-solid-svg-icons';
import { spaceScaledL } from '@cloudscape-design/design-tokens';
import { Badge } from '@cloudscape-design/components';

import { ChannelResult } from '../../api/twitch-types';
import { useGetStreamByUserLogin, useGetUsers } from '../../api/api';
import { interpolatePathname, Pathname } from 'utilities/routes';
import FluxImage from 'common/flux-image';

export default function Result({ channel }: Props) {
  const { data } = useGetStreamByUserLogin(channel.broadcaster_login);
  const { data: userData } = useGetUsers({ ids: [channel.id] });
  const streamData = data?.data[0];
  const imgSrc = streamData?.thumbnail_url.replace('{width}x{height}', '720x404');
  const href = interpolatePathname(Pathname.Live, { user: channel.broadcaster_login });

  return (
    <div style={{ display: 'flex', gap: spaceScaledL }}>
      <InternalLink href={href}>
        <FluxImage
          width={360}
          src={imgSrc}
          alt={streamData?.user_name}
          style={{ borderRadius: '12px', aspectRatio: '16 / 9' }}
        />
      </InternalLink>
      <div>
        {(channel.title || channel.game_name) && (
          <Box padding={{ bottom: 'xs' }}>
            {channel.title && (
              <InternalLink href={href}>
                <Box fontSize="heading-m" fontWeight="bold" color="inherit">
                  {channel.title}
                </Box>
              </InternalLink>
            )}
            {channel.game_name && <Box color="text-body-secondary">{channel.game_name}</Box>}
          </Box>
        )}
        <Box fontSize="body-s" color="text-body-secondary" padding={{ bottom: 'm' }}>
          {Number(streamData?.viewer_count ?? 0).toLocaleString(undefined, { notation: 'compact' })}{' '}
          watching
        </Box>
        <InternalLink
          href={interpolatePathname(Pathname.Channel, { login: channel.broadcaster_login })}
        >
          <Box color="text-body-secondary" fontSize="body-s" padding={{ bottom: 'm' }}>
            <SpaceBetween size="xs" alignItems="center" direction="horizontal">
              <Avatar userId={channel.id} size="s" />
              <SpaceBetween direction="horizontal" size="xxs" alignItems="center">
                {channel.display_name}
                {userData?.data[0].broadcaster_type === 'partner' && (
                  <Icon svg={<FontAwesomeIcon icon={faBadgeCheck} color="#a970ff" />} />
                )}
              </SpaceBetween>
            </SpaceBetween>
          </Box>
        </InternalLink>
        {channel.is_live && (
          <Badge color="red">
            <Icon svg={<FontAwesomeIcon icon={faSignalStream} />} /> LIVE
          </Badge>
        )}
      </div>
    </div>
  );
}

interface Props {
  channel: ChannelResult;
}
