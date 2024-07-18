import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Header from '@cloudscape-design/components/header';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Container from '@cloudscape-design/components/container';

import DhAppLayout from 'common/flux-app-layout';
import { useGetFollowedStreams, useGetStreams } from '../../api/api';
import useTitle from 'utilities/use-title';
import FlexibleColumnLayout from 'common/flexible-column-layout';
import VideoThumbnail from 'common/video-thumbnail';
import Empty from 'common/empty/empty';
import styles from './styles.module.scss';
import FullHeightContent from 'common/full-height-content';

const connectSearchParams = new URLSearchParams({
  response_type: 'token',
  client_id: 'w9wdgvpv3h3m957julwgkn25hxsr38',
  redirect_uri: `${window.location.origin}/`,
});
// Manually add scope because URLSearchParams encodes characters that Twitch doesn't like
// https://discuss.dev.twitch.com/t/auth-api-doesnt-recognize-a-scope-string-with-replaced-with-3a/22969/2
const scope = 'user%3Aread%3Afollows' + '+user%3Aread%3Achat' + '+user%3Awrite%3Achat';
export const connectHref = `https://id.twitch.tv/oauth2/authorize?${connectSearchParams.toString()}&scope=${scope}`;

export default function TwitchPage() {
  useTitle('Flux');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { hash, search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(hash.split('#')[1]);
    const hashAccessToken = hashParams.get('access_token');
    if (hashAccessToken) {
      localStorage.setItem('access_token', hashAccessToken);
      navigate({ hash: '' }, { replace: true });
    }
    setIsConnected(Boolean(hashAccessToken || localStorage.getItem('access_token')));
  }, [hash, navigate]);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(search);
    if (urlSearchParams.get('signOut') === 'true') {
      setIsConnected(false);
    }
  }, [search]);

  const { data, isLoading: isLoadingFollowed } = useGetFollowedStreams();
  const { data: topStreamsData, isLoading: isLoadingTop } = useGetStreams({
    type: 'live',
    pageSize: 5,
  });
  const followedStreams = data?.pages.flatMap((page) => page.data);
  const topStreams = topStreamsData?.pages.flatMap((page) => page.data);
  const isLoading = isLoadingFollowed || isLoadingTop;

  function renderContent() {
    if (!isConnected) {
      return (
        <Container
          header={
            <Header
              actions={
                <Button href={connectHref} variant="primary">
                  Sign in with Twitch
                </Button>
              }
            >
              Welcome to Flux
            </Header>
          }
        >
          Flux is an updated take on Twitch created by a single developer, powered by Twitch's
          public APIs. To use Flux, you must first authorize the connection in Twitch.
        </Container>
      );
    }
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
          <Header>Live followed channels</Header>
          <FlexibleColumnLayout columns={6} minColumnWidth={326}>
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
          <Header>Top 5 live streams</Header>
          <FlexibleColumnLayout columns={6} minColumnWidth={326}>
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

  return <DhAppLayout maxContentWidth={3100} toolsHide content={renderContent()} />;
}
