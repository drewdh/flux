import { useEffect, useState } from 'react';
import Cards, { CardsProps } from '@cloudscape-design/components/cards';
import { PaginationProps } from '@cloudscape-design/components/pagination';
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
import InfinitePagination from 'common/infinite-pagination';

export default function CategoryResults({ query }: Props) {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);

  useEffect(() => {
    setCurrentPageIndex(1);
  }, [query]);

  const { hasNextPage, data, isFetching, isFetchingNextPage, isLoading, fetchNextPage, error } =
    useSearchCategories({
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
