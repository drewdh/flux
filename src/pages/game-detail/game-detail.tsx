import ContentLayout from '@cloudscape-design/components/content-layout';
import { useParams } from 'react-router';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Tabs from '@cloudscape-design/components/tabs';
import Box from '@cloudscape-design/components/box';
import { format } from 'date-fns';
import Modal from '@cloudscape-design/components/modal';
import { useState } from 'react';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';

import FluxAppLayout from 'common/flux-app-layout';
import useTitle from 'utilities/use-title';
import { useGetGames } from '../../api/api';
import { useGetGames as useGetIgdbGames } from '../../api/igdb-query-hooks';
import FullHeightContent from 'common/full-height-content';
import LiveChannels from './live-channels';
import styles from './styles.module.scss';
import FluxImage from 'common/flux-image';

enum TabId {
  LiveChannels = 'liveChannels',
}

export default function GameDetailPage() {
  const { gameId = '' } = useParams();
  const [lightboxVisible, setLightboxVisible] = useState<boolean>(false);
  const { data, isLoading: isLoadingTwitch } = useGetGames({ ids: [gameId] });
  const gameData = data?.data[0];
  const { data: igdbData, isLoading: isLoadingIgdb } = useGetIgdbGames(
    `fields first_release_date,summary,genres.name; where id = ${gameData?.igdb_id};`,
    {
      enabled: !!gameData?.igdb_id.length,
    }
  );
  useTitle(`${gameData?.name} - Flux`);

  const imgSrc = gameData?.box_art_url.replace('{width}x{height}', '400x534');

  const loading = isLoadingIgdb || isLoadingTwitch;

  return (
    <FluxAppLayout
      toolsHide
      disableContentPaddings
      content={
        <>
          {loading ? (
            <FullHeightContent>
              <StatusIndicator type="loading">Loading game</StatusIndicator>
            </FullHeightContent>
          ) : (
            <ContentLayout
              disableOverlap
              maxContentWidth={1300}
              headerVariant="high-contrast"
              header={
                <div className={styles.header}>
                  <FluxImage
                    style={{ borderRadius: '12px', cursor: 'pointer' }}
                    onClick={() => setLightboxVisible(true)}
                    src={imgSrc}
                    width="200"
                    height="267"
                    alt={gameData?.name}
                  />
                  <SpaceBetween size="xs">
                    <Box fontSize="display-l" fontWeight="bold">
                      {gameData?.name}
                    </Box>
                    {igdbData && (
                      <>
                        <Box color="text-status-inactive">
                          <SpaceBetween size="xxs" direction="horizontal">
                            {igdbData?.[0].first_release_date && (
                              <>
                                <span>
                                  {format(igdbData?.[0].first_release_date * 1000, 'yyyy')}
                                </span>
                                &bull;
                              </>
                            )}
                            <span>{igdbData?.[0].genres[0].name}</span>
                          </SpaceBetween>
                        </Box>
                        <div style={{ maxWidth: '500px' }}>
                          <Box color="text-body-secondary">{igdbData?.[0].summary}</Box>
                        </div>
                      </>
                    )}
                  </SpaceBetween>
                </div>
              }
            >
              <Tabs
                tabs={[
                  {
                    id: TabId.LiveChannels,
                    label: 'Top streams',
                    content: <LiveChannels gameId={gameId} />,
                  },
                ]}
              />
            </ContentLayout>
          )}
          <Modal
            header={<Header>{gameData?.name}</Header>}
            footer={
              <Box float="right">
                <Button onClick={() => setLightboxVisible(false)} variant="primary">
                  Close
                </Button>
              </Box>
            }
            visible={lightboxVisible}
            onDismiss={() => setLightboxVisible(false)}
          >
            <Box textAlign="center">
              <FluxImage
                style={{ borderRadius: '12px' }}
                src={gameData?.box_art_url.replace('{width}x{height}', '1120x1494')}
                alt={gameData?.name}
                height="747"
                width="560"
              />
            </Box>
          </Modal>
        </>
      }
    />
  );
}
