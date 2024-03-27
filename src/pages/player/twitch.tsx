import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import ContentLayout from '@cloudscape-design/components/content-layout';

import styles from './styles.module.scss';
import useTitle from 'utilities/use-title';
import { useGetChannelFollowers, useGetStreamByUserLogin, useGetUsers } from '../../api/api';
import Avatar from 'common/avatar/avatar';
import RelativeTime from 'common/relative-time';
import Chat from './chat';
import Icon from '@cloudscape-design/components/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBadgeCheck } from '@fortawesome/pro-solid-svg-icons';
import Header from '@cloudscape-design/components/header';

export default function TwitchComponent() {
  const player = useRef<any>(null);
  const twitchPlayerRef = useRef<HTMLDivElement>(null);
  const [playerHeight, setPlayerHeight] = useState<string>('10px');
  const { user: username } = useParams();
  const { data: userData } = useGetUsers({ logins: [username ?? ''] });
  const user = userData?.data[0];
  const { data: followersData } = useGetChannelFollowers(user?.id);
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
    if (!twitchPlayerRef.current) {
      return;
    }
    const playerObserver = new ResizeObserver((entries, observer) => {
      console.log(entries);
      const { width } = entries[0].contentRect;
      setPlayerHeight(`${(width * 9) / 16}px`);
    });
    playerObserver.observe(twitchPlayerRef.current);
    return () => playerObserver.disconnect();
  }, []);

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

  return (
    <div className={styles.pageWrapper}>
      <Grid
        gridDefinition={[
          { colspan: { default: 12, l: 9, m: 8, s: 7 } },
          { colspan: { default: 12, l: 3, m: 4, s: 5 } },
        ]}
      >
        <SpaceBetween size="s">
          <div
            id="twitch-player"
            ref={twitchPlayerRef}
            style={{ height: playerHeight }}
            className={styles.player}
          />
          <div>
            <Box fontSize="heading-m" fontWeight="bold">
              {streamData?.title}
            </Box>
            <Box padding={{ top: 'xxs' }}>
              Streaming <b>{streamData?.game_name}</b>
            </Box>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SpaceBetween size="s" direction="horizontal" alignItems="center">
              <Avatar userId={user?.id ?? ''} />
              <div>
                <Box variant="h3" padding="n">
                  {streamData?.user_name}{' '}
                  {user?.broadcaster_type === 'partner' && (
                    <Icon svg={<FontAwesomeIcon icon={faBadgeCheck} color="#a970ff" />} />
                  )}
                </Box>
                <Box color="text-body-secondary">
                  {followersData && (
                    <>
                      {Number(followersData.total).toLocaleString(undefined, {
                        notation: 'compact',
                      })}{' '}
                      followers
                    </>
                  )}
                </Box>
              </div>
            </SpaceBetween>
            <div className={styles.stats}>
              <b>{Number(streamData?.viewer_count).toLocaleString()} watching now</b>
              <Box color="text-status-inactive" fontSize="body-s">
                Started <RelativeTime date={streamData?.started_at} inline />
              </Box>
            </div>
          </div>
        </SpaceBetween>
        <SpaceBetween size="l">
          <Chat
            broadcasterUserId={streamData?.user_id}
            height={twitchPlayerRef.current?.offsetHeight}
          />
        </SpaceBetween>
      </Grid>
    </div>
  );
}
