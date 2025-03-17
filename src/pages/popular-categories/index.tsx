import FluxAppLayout from 'common/flux-app-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Header from '@cloudscape-design/components/header';
import Alert from '@cloudscape-design/components/alert';
import Button from '@cloudscape-design/components/button';

import useTitle from 'utilities/use-title';
import { useGetTopGames } from '../../api/api';
import { interpolatePathname, Pathname } from 'utilities/routes';
import CategoryThumbnail from 'common/category-thumbnail';
import FluxCards from 'common/cards';
import { Game } from '../../api/twitch-types';
import Empty from 'common/empty/empty';
import { useFeedback } from '../../feedback/feedback-context';

export default function PopularCategories() {
  useTitle('Popular categories - Flux');
  const { setIsFeedbackVisible } = useFeedback();
  const { data, isLoading, error, isFetchingNextPage, fetchNextPage } = useGetTopGames({
    first: 25,
  });

  return (
    <FluxAppLayout
      toolsHide
      content={
        <SpaceBetween size="m">
          <Header variant="h1">Popular categories</Header>
          <FluxCards<Game>
            columns={7}
            empty={<Empty header="No live channels" />}
            error={
              <Alert
                type="error"
                header={error?.name}
                action={<Button onClick={() => setIsFeedbackVisible(true)}>Send feedback</Button>}
              >
                {error?.message}
              </Alert>
            }
            fetchingNextPage={isFetchingNextPage}
            invalid={!!error}
            itemMapper={(game) => {
              const href = interpolatePathname(Pathname.Game, { gameId: game.id });
              const imgSrc = game?.box_art_url.replace('{width}x{height}', '400x534');
              return <CategoryThumbnail imgSrc={imgSrc} href={href} title={game.name} />;
            }}
            items={data?.pages?.flatMap((data) => data.data) ?? []}
            loading={isLoading}
            loadingText="Loading categories"
            minColumnWidth={150}
            onLastItemVisible={() => fetchNextPage()}
          />
        </SpaceBetween>
      }
    />
  );
}
