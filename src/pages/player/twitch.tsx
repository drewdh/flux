import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import Header from '@cloudscape-design/components/header';

import styles from './styles.module.scss';
import useTitle from 'utilities/use-title';
import { useGetStreamByUserLogin } from '../../api/api';
import Chat from './chat';
import StreamDetails from './stream-details';
import InternalLink from 'common/internal-link';
import Box from '@cloudscape-design/components/box';
import { interpolatePathname, Pathname } from 'utilities/routes';
import Avatar from 'common/avatar';

export default function TwitchComponent() {
  const player = useRef<any>(null);
  const [playerWidth, playerRef] = useContainerQuery((rect) => rect.borderBoxWidth);
  const [playerHeight, setPlayerHeight] = useState<number>(10);
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
    setPlayerHeight(((playerWidth ?? 0) * 9) / 16);
  }, [playerWidth]);

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
      player.current?.play();
      player.current?.setMuted(false);
    });
    // return () => (player = undefined);
  }, []);

  const userHref = interpolatePathname(Pathname.Channel, { login: streamData?.user_login ?? '' });

  return (
    <div className={styles.pageWrapper}>
      <Grid
        gridDefinition={[
          { colspan: { default: 12, l: 9, m: 8, s: 7 } },
          { colspan: { default: 12, l: 3, m: 4, s: 5 } },
        ]}
      >
        <SpaceBetween size="m">
          <div
            id="twitch-player"
            ref={playerRef}
            style={{ height: `${playerHeight}px` }}
            className={styles.player}
          />
          <SpaceBetween size="s">
            <Header>{streamData?.title}</Header>
            <SpaceBetween size="xs" direction="horizontal">
              <InternalLink href={userHref}>
                <Avatar userId={streamData?.user_id} size="m" />
              </InternalLink>
              <Box fontWeight="bold">
                <InternalLink href={userHref} variant="primary" fontSize="heading-m">
                  {streamData?.user_name}
                </InternalLink>
              </Box>
            </SpaceBetween>
          </SpaceBetween>
          <StreamDetails broadcasterUserId={streamData?.user_id} />
        </SpaceBetween>
        <SpaceBetween size="l">
          <Chat broadcasterUserId={streamData?.user_id} height={playerHeight} />
        </SpaceBetween>
      </Grid>
    </div>
  );
}
