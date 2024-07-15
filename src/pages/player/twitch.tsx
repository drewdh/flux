import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';

import styles from './styles.module.scss';
import useTitle from 'utilities/use-title';
import { useGetStreamByUserLogin } from '../../api/api';
import StreamDetails from './stream-details';
import Box from '@cloudscape-design/components/box';
import Avatar from 'common/avatar';
import { topNavSelector } from '../../top-navigation/constants';

export default function TwitchComponent({ onUserIdChange }: Props) {
  const player = useRef<any>(null);
  const { user: username } = useParams();
  useTitle(`${username} - Flux`);

  useEffect(() => {
    // Force player to update channel when URL changes
    player.current?.setChannel(username);
  }, [username]);

  // Viewer count seems to be updated every 60 seconds, so let's refetch that often
  const { data } = useGetStreamByUserLogin(username, { refetchInterval: 1000 * 60 });
  const streamData = data?.data?.[0];

  const options = {
    width: '100%',
    height: '100%',
    channel: username,
    autoplay: true,
    muted: false,
  };

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
  }, []);

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
        <SpaceBetween size="s">
          <Header>{streamData?.title}</Header>
          <SpaceBetween size="xs" direction="horizontal">
            <Link onClick={() => onUserIdChange(streamData?.user_id ?? null)}>
              <Avatar userId={streamData?.user_id} size="m" />
            </Link>
            <Box fontWeight="bold">
              <Link
                onClick={() => onUserIdChange(streamData?.user_id ?? null)}
                fontSize="heading-m"
              >
                {streamData?.user_name}
              </Link>
            </Box>
          </SpaceBetween>
        </SpaceBetween>
        <StreamDetails broadcasterUserId={streamData?.user_id} />
      </SpaceBetween>
    </div>
  );
}

interface Props {
  onUserIdChange: (userId: string | null) => void;
}
