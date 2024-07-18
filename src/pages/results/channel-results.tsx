import { useEffect, useState } from 'react';
import Cards, { CardsProps } from '@cloudscape-design/components/cards';
import { PaginationProps } from '@cloudscape-design/components/pagination';
import Header from '@cloudscape-design/components/header';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';

import { useSearchChannels } from '../../api/api';
import useCounter from 'utilities/use-counter';
import { ChannelResult } from '../../api/twitch-types';
import InternalLink from 'common/internal-link';
import { interpolatePathname, Pathname } from 'utilities/routes';
import useGetRelativeTime from 'utilities/get-relative-time';
import Empty from 'common/empty/empty';
import InfinitePagination from 'common/infinite-pagination';

export default function ChannelResults({ query }: Props) {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);
  const getRelativeTime = useGetRelativeTime();

  useEffect(() => {
    setCurrentPageIndex(1);
  }, [query]);

  const { hasNextPage, data, isFetching, isFetchingNextPage, isLoading, fetchNextPage, error } =
    useSearchChannels({
      query,
      pageSize: 12,
    });

  const counter = useCounter({
    count: data?.pages.flatMap((page) => page.data).length ?? 0,
    isOpenEnd: hasNextPage,
    isLoading: isLoading,
  });

  const items = data?.pages[currentPageIndex - 1]?.data ?? [];

  function handlePaginationChange(event: NonCancelableCustomEvent<PaginationProps.ChangeDetail>) {
    setCurrentPageIndex(event.detail.currentPageIndex);
  }

  const cardDefinition: CardsProps.CardDefinition<ChannelResult> = {
    header: (item) => (
      <InternalLink
        href={interpolatePathname(Pathname.Live, { user: item.broadcaster_login })}
        fontSize="heading-m"
      >
        {item.display_name}
      </InternalLink>
    ),
    sections: [
      {
        header: 'Title',
        content: (item) => item.title || '-',
      },
      {
        header: 'Category',
        width: 50,
        content: (item) => item.game_name,
      },
      {
        header: 'Started',
        width: 50,
        content: (item) => getRelativeTime(item.started_at),
      },
    ],
  };

  return (
    <Cards
      stickyHeader
      empty={<Empty header="No matches" />}
      header={
        <Header
          actions={
            <InfinitePagination
              data={data}
              currentPageIndex={currentPageIndex}
              onChange={handlePaginationChange}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
            />
          }
          counter={counter}
        >
          Live channels
        </Header>
      }
      items={items}
      cardDefinition={cardDefinition}
      loadingText="Loading channels"
      loading={isFetching}
    />
  );
}

interface Props {
  query: string;
}
