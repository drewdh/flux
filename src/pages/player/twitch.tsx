import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';

import styles from './styles.module.scss';
import useTitle from 'utilities/use-title';
import { useGetChannelFollowers, useGetStreams, useGetUsers } from '../../api/api';
import StreamDetails from './stream-details';
import { topNavSelector } from '../../top-navigation/constants';
import InternalLink from 'common/internal-link';
import { interpolatePathname, Pathname } from 'utilities/routes';
import Avatar from 'common/avatar';
import ProfileDetails from './profile-details';

export default function TwitchComponent({}: Props) {
  const player = useRef<any>(null);
  const { user: username } = useParams();
  useTitle(`${username} - Flux`);

  useEffect(() => {
    // Force player to update channel when URL changes
    player.current?.setChannel(username);
  }, [username]);

  // Viewer count seems to be updated every 60 seconds, so let's refetch that often
  const { data: _streamData } = useGetStreams(
    { userLogins: [username!] },
    { enabled: !!username, refetchInterval: 60000 }
  );
  const streamData = _streamData?.pages[0].data[0];

  const { data: _userData } = useGetUsers({ logins: [username!] }, { enabled: !!username });
  const streamerUserId = _userData?.data[0]?.id;

  const options = useMemo(
    () => ({
      width: '100%',
      height: '100%',
      channel: username,
      autoplay: true,
      muted: false,
    }),
    [username]
  );

  useLayoutEffect(() => {
    if (!player.current) {
      // @ts-ignore
      player.current = new Twitch.Player('twitch-player', options);
    }
    // @ts-ignore
    player.current?.addEventListener(Twitch.Player.PLAY, () => {
      player.current?.setMuted(false);
    });
    // @ts-ignore
    player.current?.addEventListener(Twitch.Player.READY, () => {
      (document.querySelector('#twitch-player iframe') as HTMLIFrameElement)?.focus();
      player.current?.play();
      player.current?.setMuted(false);
    });
    // return () => (player = undefined);
  }, [options]);

  // Adjust max width so entire video player is visible when side panel is closed
  const navHeight = document.querySelector(topNavSelector)?.getBoundingClientRect().height ?? 0;
  const maxPlayerHeight = window.innerHeight - 24 - navHeight;

  return (
    <div className={styles.pageWrapper}>
      <SpaceBetween size="m">
        <div
          id="twitch-player"
          style={{ maxHeight: `${maxPlayerHeight}px` }}
          className={styles.player}
        />
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
