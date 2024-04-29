import Alert from '@cloudscape-design/components/alert';
import Button from '@cloudscape-design/components/button';
import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';

import DhAppLayout from 'common/flux-app-layout';
import { useGetFollowedStreams, useGetStreams } from '../../api/api';
import useLocalStorage, { LocalStorageKey } from 'utilities/use-local-storage';
import useTitle from 'utilities/use-title';
import FlexibleColumnLayout from 'common/flexible-column-layout';
import VideoThumbnail from 'common/video-thumbnail';
import Empty from 'common/empty/empty';
import styles from './styles.module.scss';
import Header from '@cloudscape-design/components/header';

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
  const [hasWelcome, setHasWelcome] = useLocalStorage(LocalStorageKey.WelcomeMessage, true);
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

  const { data } = useGetFollowedStreams();
  const { data: topStreamsData } = useGetStreams({ type: 'live', pageSize: 5 });
  const followedStreams = data?.pages.flatMap((page) => page.data);
  const topStreams = topStreamsData?.data;

  return (
    <DhAppLayout
      maxContentWidth={3100}
      toolsHide
      content={
        <SpaceBetween size="l">
          {isConnected && hasWelcome && (
            <Alert
              dismissible
              type="info"
              header="Welcome to Flux"
              onDismiss={() => setHasWelcome(false)}
            >
              Flux is an updated take on Twitch. Flux is not associated with Twitch. All Twitch
              functionality is provided directly through Twitch.
            </Alert>
          )}
          {!isConnected && (
            <Alert
              type="info"
              header="Sign in with Twitch"
              action={<Button href={connectHref}>Sign in</Button>}
            >
              To access your content, sign in with Twitch.
            </Alert>
          )}
          {isConnected && (
            <SpaceBetween size="l">
              <SpaceBetween size="m">
                <Header>Live followed channels</Header>
                <FlexibleColumnLayout columns={6} minColumnWidth={326}>
                  {followedStreams?.map((stream) => (
                    <VideoThumbnail showCategory stream={stream} />
                  ))}
                  {followedStreams && !followedStreams.length && (
                    <div className={styles.empty}>
                      <Empty
                        header="No streams"
                        message="No channel you follow is live right now."
                      />
                    </div>
                  )}
                </FlexibleColumnLayout>
              </SpaceBetween>
              <SpaceBetween size="m">
                <Header>Top 5 live streams</Header>
                <FlexibleColumnLayout columns={6} minColumnWidth={326}>
                  {topStreams?.map((stream, index) => (
                    <VideoThumbnail
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
          )}
        </SpaceBetween>
      }
    />
  );
}
