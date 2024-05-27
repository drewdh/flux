import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { format } from 'date-fns';

import { useGetGames } from '../../api/api';
import { useGetGames as useGetIgdbGames } from '../../api/igdb-query-hooks';
import InternalLink from 'common/internal-link';
import styles from './styles.module.scss';
import { interpolatePathname, Pathname } from 'utilities/routes';
import FluxImage from 'common/flux-image';

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
      <Box variant="h3">Streaming</Box>
      <InternalLink href={href}>
        <SpaceBetween size="xs">
          <FluxImage
            style={{
              display: 'block',
              borderRadius: '12px',
            }}
            src={imgSrc}
            height="160"
            width="120"
            alt={data.data[0].name}
          />
          <div>
            <Box>{data.data[0].name}</Box>
            {igdbData && (
              <Box color="text-body-secondary" fontSize="body-s">
                <SpaceBetween size="xxs" direction="horizontal">
                  {igdbData?.[0].first_release_date && (
                    <>
                      {format(igdbData?.[0].first_release_date * 1000, 'yyyy')}
                      &bull;
                    </>
                  )}
                  {igdbData?.[0].genres[0].name}
                </SpaceBetween>
              </Box>
            )}
          </div>
        </SpaceBetween>
      </InternalLink>
    </div>
  );
}

export interface GameDetailsProps {
  gameId: string | undefined;
}
