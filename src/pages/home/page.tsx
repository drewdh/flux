import { useCallback } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
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
import ButtonLink from 'common/button-link';

export default function TwitchPage() {
  useTitle('Flux');
  const { hash } = useLocation();
  const navigate = useNavigate();

  const getAccessToken = useCallback((): string | null => {
    const hashParams = new URLSearchParams(hash.split('#')[1]);
    const hashAccessToken = hashParams.get('access_token');
    // TODO: Handle user denying permission
    if (hashAccessToken) {
      localStorage.setItem('access_token', hashAccessToken);
      navigate({ hash: '' }, { replace: true });
    }
    return hashAccessToken || localStorage.getItem('access_token');
  }, [hash, navigate]);

  const { data, isLoading: isLoadingFollowed } = useGetFollowedStreams();
  const { data: topStreamsData, isLoading: isLoadingTopStreams } = useGetStreams({
    type: 'live',
    pageSize: 10,
  });
  const { data: topGamesData, isLoading: isLoadingTopGames } = useGetTopGames({ first: 10 });
  const followedStreams = data?.pages.flatMap((page) => page.data);
  const topStreams = topStreamsData?.pages.flatMap((page) => page.data);
  const topGames = topGamesData?.pages.flatMap((page) => page.data);
  const isLoading = isLoadingFollowed || isLoadingTopStreams || isLoadingTopGames;

  if (!getAccessToken()) {
    return <Navigate to={Pathname.Welcome} />;
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
      <SpaceBetween size="xxl">
        <SpaceBetween size="m">
          <Header>Following</Header>
          <FlexibleColumnLayout columns={4} minColumnWidth={400}>
            {followedStreams?.map((stream) => <VideoThumbnail showCategory live stream={stream} />)}
            {followedStreams && !followedStreams.length && (
              <div className={styles.empty}>
                <Empty header="No streams" message="No channel you follow is live right now." />
              </div>
            )}
          </FlexibleColumnLayout>
        </SpaceBetween>
        <SpaceBetween size="m">
          <SpaceBetween size="xs" direction="horizontal">
            <Header>Popular categories</Header>
            <ButtonLink
              iconName="angle-right"
              ariaLabel="Show more"
              href={Pathname.PopularCategories}
            />
          </SpaceBetween>
          <FlexibleColumnLayout columns={10} minColumnWidth={200}>
            {topGames?.map((game) => {
              const href = interpolatePathname(Pathname.Game, { gameId: game.id });
              const imgSrc = game?.box_art_url.replace('{width}x{height}', '400x534');
              return <CategoryThumbnail imgSrc={imgSrc} href={href} title={game.name} />;
            })}
          </FlexibleColumnLayout>
        </SpaceBetween>
        <SpaceBetween size="m">
          <Header>Popular streams</Header>
          <FlexibleColumnLayout columns={4} minColumnWidth={400}>
            {topStreams?.map((stream, index) => (
              <VideoThumbnail
                live
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

  return <DhAppLayout maxContentWidth={4000} toolsHide content={renderContent()} />;
}
