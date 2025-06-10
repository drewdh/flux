import React from 'react';
import { useParams } from 'react-router';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';

import styles from './styles.module.scss';
import useTitle from 'utilities/use-title';
import { useGetChannelFollowers, useGetStreams, useGetUsers } from '../../api/api';
import Avatar from 'common/avatar';
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
  const userData = _userData?.data[0];

  const { data: followerData } = useGetChannelFollowers({
    broadcasterId: userData?.id,
  });
  const followerCount =
    followerData?.total.toLocaleString(undefined, { notation: 'compact' }) ?? '0';

  return (
    <div className={styles.pageWrapper}>
      <Player username={username} />
      <div className={styles.container}>
        {/* TODO: Use custom style to prevent wrapping */}
        <SpaceBetween size="m" direction="horizontal">
          <Avatar userId={userData?.id} size="l" />
          <SpaceBetween size="xs">
            <Box variant="h2">{streamData?.title}</Box>
            <SpaceBetween size="xs" direction="horizontal">
              <Badge color="red">LIVE</Badge>
              <Box variant="span" color="text-status-error">
                {/* @ts-ignore */}
                {getStreamDuration(new Date(streamData?.started_at))}
              </Box>
              <Box color="text-status-inactive" variant="span">
                &bull;
              </Box>
              <Box variant="span" color="text-status-inactive">
                {streamData?.viewer_count.toLocaleString()} viewers
              </Box>
              <Badge color="grey">{streamData?.game_name}</Badge>
            </SpaceBetween>
            <SpaceBetween size="xs" direction="horizontal">
              <Box color="text-status-inactive" variant="span">
                {userData?.display_name}
              </Box>
              <Box color="text-status-inactive" variant="span">
                &bull;
              </Box>
              <Box color="text-status-inactive" variant="span">
                {followerCount} followers
              </Box>
            </SpaceBetween>
            {/* TODO: Remove these */}
            {/*<StreamDetails broadcasterUserId={streamerUserId} />*/}
            {/*<ProfileDetails userId={streamerUserId} />*/}
          </SpaceBetween>
        </SpaceBetween>
      </div>
    </div>
  );
}

interface Props {}

function getStreamDuration(streamStartDate: string | undefined) {
  if (!streamStartDate) {
    return '-';
  }
  const now = new Date();
  const startTime = new Date(streamStartDate);

  // Calculate difference in milliseconds
  // @ts-ignore
  const diffMs = now - startTime;

  // Handle invalid dates or negative durations
  if (isNaN(diffMs) || diffMs < 0) {
    return '0m';
  }

  // Convert to minutes and hours
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Format the output
  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}
