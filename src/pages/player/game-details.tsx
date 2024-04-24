import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';

import { useGetGames } from '../../api/api';
import { useGetGames as useGetIgdbGames } from '../../api/igdb-query-hooks';
import InternalLink from 'common/internal-link';
import styles from './styles.module.scss';
import { interpolatePathname, Pathname } from 'utilities/routes';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { format } from 'date-fns';

export default function GameDetails({ gameId }: GameDetailsProps) {
  const { data } = useGetGames({ ids: [gameId!] }, { enabled: !!gameId });
  const { data: igdbData } = useGetIgdbGames(
    `fields first_release_date,summary,genres.name; where id = ${data?.data[0].igdb_id};`,
    {
      enabled: !!data?.data[0].igdb_id.length,
    }
  );

  if (!data || !gameId) {
    return null;
  }

  const imgSrc = data.data[0].box_art_url.replace('{width}x{height}', '240x320');
  const href = interpolatePathname(Pathname.Game, { gameId });

  return (
    <div className={styles.gameDetailsWrapper}>
      <InternalLink href={href}>
        <Container disableContentPaddings>
          <div style={{ display: 'flex' }}>
            <div style={{ margin: '8px 0 8px 8px', borderRadius: '8px', overflow: 'hidden' }}>
              <img
                style={{
                  display: 'block',
                }}
                src={imgSrc}
                height="160"
                width="120"
                alt={data.data[0].name}
              />
            </div>
            <Box padding="l">
              <Box fontSize="heading-s" fontWeight="bold" padding={{ bottom: 'xs' }}>
                {data.data[0].name}
              </Box>
              {igdbData && (
                <Box color="text-body-secondary">
                  <SpaceBetween size="xxs" direction="horizontal">
                    {format(igdbData?.[0].first_release_date * 1000, 'yyyy')}
                    &bull;
                    {igdbData?.[0].genres[0].name}
                  </SpaceBetween>
                </Box>
              )}
            </Box>
          </div>
        </Container>
      </InternalLink>
    </div>
  );
}

export interface GameDetailsProps {
  gameId: string | undefined;
}
