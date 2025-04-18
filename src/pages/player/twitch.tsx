import React from 'react';
import { useParams } from 'react-router';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';

import styles from './styles.module.scss';
import useTitle from 'utilities/use-title';
import { useGetChannelFollowers, useGetStreams, useGetUsers } from '../../api/api';
import StreamDetails from './stream-details';
import InternalLink from 'common/internal-link';
import { interpolatePathname, Pathname } from 'utilities/routes';
import Avatar from 'common/avatar';
import ProfileDetails from './profile-details';
import Player from './player';

export default function TwitchComponent({}: Props) {
  const { user: username } = useParams();
  useTitle(`${username} - Flux`);

  // Viewer count seems to be updated every 60 seconds, so let's refetch that often
  const { data: _streamData } = useGetStreams(
    { userLogins: [username!] },
    { enabled: !!username, refetchInterval: 60000 }
  );
  const streamData = _streamData?.pages[0].data[0];

  const { data: _userData } = useGetUsers({ logins: [username!] }, { enabled: !!username });
  const streamerUserId = _userData?.data[0]?.id;

  return (
    <div className={styles.pageWrapper}>
      <SpaceBetween size="m">
        <Player username={username} />
        <SpaceBetween size="l">
          <SpaceBetween size="xxs">
            <Header variant="h3" headingTagOverride="h1">
              {streamData?.title}
            </Header>
            <UserInfo userId={streamerUserId} />
          </SpaceBetween>
          <StreamDetails broadcasterUserId={streamerUserId} />
          <ProfileDetails userId={streamerUserId} />
        </SpaceBetween>
      </SpaceBetween>
    </div>
  );
}

interface Props {}

interface UserInfoProps {
  userId: string | undefined;
}
function UserInfo({ userId }: UserInfoProps) {
  const { data: followerData } = useGetChannelFollowers({
    broadcasterId: userId,
  });
  const { data: _userData } = useGetUsers({ ids: [userId!] }, { enabled: !!userId });
  const userData = _userData?.data[0];

  return (
    <SpaceBetween size="xs" direction="horizontal" alignItems="center">
      <InternalLink
        variant="primary"
        href={interpolatePathname(Pathname.Profile, {
          login: userData?.login ?? '',
        })}
      >
        <Avatar userId={userId} size="m" />
      </InternalLink>
      <SpaceBetween direction="vertical" size="xxs">
        <InternalLink
          variant="primary"
          href={interpolatePathname(Pathname.Profile, {
            login: userData?.login ?? '',
          })}
        >
          {userData?.display_name}
        </InternalLink>
        <Box variant="small" color="text-body-secondary">
          {followerData?.total.toLocaleString(undefined, { notation: 'compact' }) ?? '0'} followers
        </Box>
      </SpaceBetween>
    </SpaceBetween>
  );
}
