import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Header from '@cloudscape-design/components/header';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import DhAppLayout from 'common/flux-app-layout';
import { useGetFollowedStreams, useGetStreams, useGetTopGames } from '../../api/api';
import useTitle from 'utilities/use-title';
import FlexibleColumnLayout from 'common/flexible-column-layout';
import VideoThumbnail from 'common/video-thumbnail';
import Empty from 'common/empty/empty';
import styles from './styles.module.scss';
import FullHeightContent from 'common/full-height-content';
import CategoryThumbnail from 'common/category-thumbnail';
import { interpolatePathname, Pathname } from 'utilities/routes';

const connectSearchParams = new URLSearchParams({
  response_type: 'token',
  client_id: 'w9wdgvpv3h3m957julwgkn25hxsr38',
  redirect_uri: `${window.location.origin}/`,
});
// Manually add scope because URLSearchParams encodes characters that Twitch doesn't like
// https://discuss.dev.twitch.com/t/auth-api-doesnt-recognize-a-scope-string-with-replaced-with-3a/22969/2
// eslint-disable-next-line no-useless-concat
const scope = 'user%3Aread%3Afollows' + '+user%3Aread%3Achat' + '+user%3Awrite%3Achat';
export const connectHref = `https://id.twitch.tv/oauth2/authorize?${connectSearchParams.toString()}&scope=${scope}`;

export default function TwitchPage() {
  useTitle('Flux');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(hash.split('#')[1]);
    const hashAccessToken = hashParams.get('access_token');
    if (hashAccessToken) {
      localStorage.setItem('access_token', hashAccessToken);
      navigate({ hash: '' }, { replace: true });
    }
    // TODO: Handle user denying permission
    setIsConnected(Boolean(hashAccessToken || localStorage.getItem('access_token')));
  }, [hash, navigate]);

  const { data, isLoading: isLoadingFollowed } = useGetFollowedStreams();
  const { data: topStreamsData, isLoading: isLoadingTopStreams } = useGetStreams({
    type: 'live',
    pageSize: 10,
  });
  const { data: topGamesData, isLoading: isLoadingTopGames } = useGetTopGames({ first: 7 });
  const followedStreams = data?.pages.flatMap((page) => page.data);
  const topStreams = topStreamsData?.pages.flatMap((page) => page.data);
  const isLoading = isLoadingFollowed || isLoadingTopStreams || isLoadingTopGames;

  if (!isConnected) {
    navigate(Pathname.Welcome);
  }

  function renderContent() {
    if (isLoading) {
      return (
        <FullHeightContent>
          <StatusIndicator type="loading">Loading</StatusIndicator>
        </FullHeightContent>
      );
    }
    return (
      <SpaceBetween size="l">
        <SpaceBetween size="m">
          <Header>Following</Header>
          <FlexibleColumnLayout columns={6} minColumnWidth={350}>
            {followedStreams?.map((stream) => (
              <VideoThumbnail showCategory isLive stream={stream} />
            ))}
            {followedStreams && !followedStreams.length && (
              <div className={styles.empty}>
                <Empty header="No streams" message="No channel you follow is live right now." />
              </div>
            )}
          </FlexibleColumnLayout>
        </SpaceBetween>
        <SpaceBetween size="m">
          <Header>Popular categories</Header>
          <FlexibleColumnLayout columns={7} minColumnWidth={150}>
            {topGamesData?.data?.map((game) => {
              const href = interpolatePathname(Pathname.Game, { gameId: game.id });
              const imgSrc = game?.box_art_url.replace('{width}x{height}', '400x534');
              return <CategoryThumbnail imgSrc={imgSrc} href={href} title={game.name} />;
            })}
          </FlexibleColumnLayout>
        </SpaceBetween>
        <SpaceBetween size="m">
          <Header>Popular streams</Header>
          <FlexibleColumnLayout columns={6} minColumnWidth={350}>
            {topStreams?.map((stream, index) => (
              <VideoThumbnail
                isLive
                rankText={Number(index + 1).toString()}
                showCategory
                stream={stream}
              />
            ))}
            {topStreams && !topStreams.length && (
              <div className={styles.empty}>
                <Empty header="No streams" message="No channel is live right now." />
              </div>
            )}
          </FlexibleColumnLayout>
        </SpaceBetween>
      </SpaceBetween>
    );
  }

  return <DhAppLayout maxContentWidth={1600} toolsHide content={renderContent()} />;
}
