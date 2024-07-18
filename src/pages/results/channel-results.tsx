import { useState } from 'react';
import Cards, { CardsProps } from '@cloudscape-design/components/cards';
import Pagination, { PaginationProps } from '@cloudscape-design/components/pagination';
import Header from '@cloudscape-design/components/header';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';

import { useSearchChannels } from '../../api/api';
import useCounter from 'utilities/use-counter';
import { ChannelResult } from '../../api/twitch-types';
import InternalLink from 'common/internal-link';
import { interpolatePathname, Pathname } from 'utilities/routes';
import useGetRelativeTime from 'utilities/get-relative-time';
import Empty from 'common/empty/empty';

export default function ChannelResults({ query }: Props) {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);
  const getRelativeTime = useGetRelativeTime();

  const { hasNextPage, data, isFetching, isLoading, fetchNextPage, error } = useSearchChannels({
    query,
    pageSize: 12,
  });

  const counter = useCounter({
    count: data?.pages.flatMap((page) => page.data).length ?? 0,
    isOpenEnd: hasNextPage,
    isLoading: isLoading,
  });

  const items = data?.pages[currentPageIndex - 1]?.data ?? [];

  const pagesCount = data?.pages.length ?? 1;

  function handlePaginationChange(event: NonCancelableCustomEvent<PaginationProps.ChangeDetail>) {
    setCurrentPageIndex(event.detail.currentPageIndex);
  }

  function handleNextPageClick(event: NonCancelableCustomEvent<PaginationProps.PageClickDetail>) {
    const { requestedPageAvailable } = event.detail;
    if (!requestedPageAvailable && hasNextPage) {
      fetchNextPage();
    }
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
            <Pagination
              disabled={isFetching}
              onChange={handlePaginationChange}
              onNextPageClick={handleNextPageClick}
              currentPageIndex={currentPageIndex}
              pagesCount={pagesCount}
              openEnd={hasNextPage}
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
