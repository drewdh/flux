import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import styles from './player.module.scss';
import { topNavSelector } from '../../top-navigation/constants';

export default function Player({ username }: PlayerProps) {
  const player = useRef<any>(null);

  // Force player to update channel when URL changes
  useEffect(() => {
    player.current?.setChannel(username);
  }, [username]);

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

  // Adjust max width so entire video player is visible when side panel is closed
  const navHeight = document.querySelector(topNavSelector)?.getBoundingClientRect().height ?? 0;
  const maxPlayerHeight = window.innerHeight - 24 - navHeight;

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

  return (
    <div
      id="twitch-player"
      style={{ maxHeight: `${maxPlayerHeight}px` }}
      className={styles.wrapper}
    />
  );
}

interface PlayerProps {
  username: string | undefined;
}
