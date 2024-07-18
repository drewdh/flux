import { useState } from 'react';
import Cards, { CardsProps } from '@cloudscape-design/components/cards';
import Pagination, { PaginationProps } from '@cloudscape-design/components/pagination';
import Header from '@cloudscape-design/components/header';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';

import { useSearchCategories } from '../../api/api';
import useCounter from 'utilities/use-counter';
import { CategoryResult } from '../../api/twitch-types';
import InternalLink from 'common/internal-link';
import { interpolatePathname, Pathname } from 'utilities/routes';
import Empty from 'common/empty/empty';
import FluxImage from 'common/flux-image';
import styles from './styles.module.scss';

export default function CategoryResults({ query }: Props) {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);

  const { hasNextPage, data, isFetching, isLoading, fetchNextPage, error } = useSearchCategories({
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

  const cardDefinition: CardsProps.CardDefinition<CategoryResult> = {
    header: (item) => {
      const href = interpolatePathname(Pathname.Game, { gameId: item.id });
      return (
        <InternalLink href={href} fontSize="heading-m">
          {item.name}
        </InternalLink>
      );
    },
    sections: [
      {
        id: 'image',
        content: (item) => {
          const href = interpolatePathname(Pathname.Game, { gameId: item.id });
          const imgSrc = item?.box_art_url.replace(/-\d+x\d+/g, `-${400}x${534}`);
          return (
            <InternalLink href={href}>
              <FluxImage className={styles.categoryBoxArt} src={imgSrc} alt={item.name} />
            </InternalLink>
          );
        },
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
          Categories
        </Header>
      }
      items={items}
      cardDefinition={cardDefinition}
      loadingText="Loading categories"
      loading={isFetching}
    />
  );
}

interface Props {
  query: string;
}
