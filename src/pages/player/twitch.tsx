import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router';
import SpaceBetween from '@cloudscape-design/components/space-between';

import styles from './styles.module.scss';
import useTitle from 'utilities/use-title';
import { useGetStreamByUserLogin } from '../../api/api';
import StreamDetails from './stream-details';
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
        <StreamDetails broadcasterUserId={streamData?.user_id} />
      </SpaceBetween>
    </div>
  );
}

interface Props {
  onUserIdChange: (userId: string | null) => void;
}
