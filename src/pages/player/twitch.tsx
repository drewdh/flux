import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Icon from '@cloudscape-design/components/icon';
import { faBadgeCheck } from '@fortawesome/pro-solid-svg-icons';

import styles from './styles.module.scss';
import useTitle from 'utilities/use-title';
import { useGetChannelFollowers, useGetStreamByUserLogin, useGetUsers } from '../../api/api';
import Avatar from 'common/avatar';
import Chat from './chat';
import Details from './details';
import FollowButton from 'common/follow-button';
import InternalLink from 'common/internal-link';
import { interpolatePathname, Pathname } from 'utilities/routes';
import GameDetails from './game-details';

export default function TwitchComponent() {
  const player = useRef<any>(null);
  const twitchPlayerRef = useRef<HTMLDivElement>(null);
  const [playerHeight, setPlayerHeight] = useState<string>('10px');
  const { user: username } = useParams();
  const { data: userData } = useGetUsers({ logins: [username ?? ''] });
  const user = userData?.data[0];
  const { data: followersData } = useGetChannelFollowers({ broadcasterId: user?.id });
  useTitle(`${username} - Flux`);

  useEffect(() => {
    // Force player to update channel when URL changes
    player.current?.setChannel(username);
  }, [username]);

  // Viewer count seems to be updated every 60 seconds, so let's refetch that often
  const { data } = useGetStreamByUserLogin(username, { refetchInterval: 1000 * 60 });
  const streamData = data?.data?.[0];

  const channelHref = interpolatePathname(Pathname.Channel, { login: username ?? '' });

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
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <SpaceBetween size="s" direction="horizontal" alignItems="center">
              <InternalLink href={channelHref}>
                <Avatar userId={user?.id ?? ''} />
              </InternalLink>
              <div>
                <InternalLink href={channelHref}>
                  <Box variant="h3" padding="n">
                    {user?.display_name}{' '}
                    {user?.broadcaster_type === 'partner' && (
                      <Icon svg={<FontAwesomeIcon icon={faBadgeCheck} color="#a970ff" />} />
                    )}
                  </Box>
                </InternalLink>
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
            <FollowButton broadcasterId={streamData?.user_id} />
          </div>
          <Details streamLogin={username} />
          <GameDetails gameId={streamData?.game_id} />
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
