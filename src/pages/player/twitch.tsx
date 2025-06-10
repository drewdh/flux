import React from 'react';
import { useParams } from 'react-router';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import Header from '@cloudscape-design/components/header';

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
    <div className={styles.container}>
      <Player username={username} />
      <div className={styles.content}>
        <SpaceBetween size="s">
          {streamData && (
            <SpaceBetween size="s">
              <Header variant="h2" headingTagOverride="h1">
                {streamData?.title ?? '-'}
              </Header>
              <div className={styles.metadata}>
                <div>{streamData?.game_name ?? '-'}</div>
                <div>{streamData?.viewer_count.toLocaleString()} viewers</div>
                <div>{getStreamDuration(streamData.started_at)}</div>
              </div>
            </SpaceBetween>
          )}
          <div className={styles.userInfo}>
            <Avatar userId={userData?.id} size="l" />
            <div>
              <div className={styles.userName}>
                <Box variant="h4">{userData?.display_name}</Box>
                {streamData && <Badge color="red">LIVE</Badge>}
                {!streamData && <Badge color="grey">Offline</Badge>}
              </div>
              <Box variant="small" color="text-status-inactive">
                {followerCount} followers
              </Box>
            </div>
          </div>
          {streamData && (
            <div className={styles.tags}>{streamData.tags?.map((tag) => <div>#{tag}</div>)}</div>
          )}
        </SpaceBetween>
      </div>
    </div>
  );
}

interface Props {}

function getStreamDuration(streamStartDate: string) {
  const now = new Date();
  const startTime = new Date(streamStartDate);

  // Calculate difference in milliseconds
  const diffMs = now.getTime() - startTime.getTime();

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
