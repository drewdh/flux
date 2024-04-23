import ContentLayout from '@cloudscape-design/components/content-layout';
import { useParams } from 'react-router';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Tabs from '@cloudscape-design/components/tabs';
import Box from '@cloudscape-design/components/box';
import { format } from 'date-fns';

import FluxAppLayout from 'common/flux-app-layout';
import useTitle from 'utilities/use-title';
import { useGetGames } from '../../api/api';
import { useGetGames as useGetIgdbGames } from '../../api/igdb-query-hooks';
import FullHeightContent from 'common/full-height-content';
import Alert from '@cloudscape-design/components/alert';

enum TabId {
  LiveChannels = 'liveChannels',
}

export default function GameDetailPage() {
  const { gameId = '' } = useParams();
  const { data, isLoading: isLoadingTwitch } = useGetGames({ ids: [gameId] });
  const gameData = data?.data[0];
  const { data: igdbData, isLoading: isLoadingIgdb } = useGetIgdbGames(
    `fields first_release_date,summary,genres.name; where id = ${gameData?.igdb_id};`,
    {
      enabled: !!gameData?.igdb_id.length,
    }
  );
  useTitle(`${gameData?.name} - Flux`);

  const imgSrc = gameData?.box_art_url.replace('{width}x{height}', '300x417');

  const loading = isLoadingIgdb || isLoadingTwitch;

  return (
    <FluxAppLayout
      toolsHide
      maxContentWidth={1300}
      content={
        loading ? (
          <FullHeightContent>
            <StatusIndicator type="loading">Loading game</StatusIndicator>
          </FullHeightContent>
        ) : (
          <ContentLayout
            header={
              <SpaceBetween size="xxl" direction="horizontal" alignItems="center">
                <img src={imgSrc} width="150" />
                <SpaceBetween size="xs">
                  <Box fontSize="display-l" fontWeight="bold">
                    {gameData?.name}
                  </Box>
                  {igdbData && (
                    <>
                      <Box color="text-status-inactive">
                        <SpaceBetween size="xxs" direction="horizontal">
                          <span>{format(igdbData?.[0].first_release_date * 1000, 'yyyy')}</span>
                          &bull;
                          <span>{igdbData?.[0].genres[0].name}</span>
                        </SpaceBetween>
                      </Box>
                      <div style={{ maxWidth: '700px' }}>
                        <Box color="text-body-secondary">{igdbData?.[0].summary}</Box>
                      </div>
                    </>
                  )}
                </SpaceBetween>
              </SpaceBetween>
            }
          >
            <Tabs
              tabs={[
                {
                  id: TabId.LiveChannels,
                  label: 'Live channels',
                  content: <Alert>Coming soon.</Alert>,
                },
              ]}
            />
          </ContentLayout>
        )
      }
    />
  );
}
