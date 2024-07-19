import { useEffect, useState } from 'react';
import { PaginationProps } from '@cloudscape-design/components/pagination';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';

import { useSearchCategories } from '../../api/api';
import { CategoryResult } from '../../api/twitch-types';
import { interpolatePathname, Pathname } from 'utilities/routes';
import Empty from 'common/empty/empty';
import InfinitePagination from 'common/infinite-pagination';
import FluxCards from 'common/cards';
import CategoryThumbnail from 'common/category-thumbnail';

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

  const items = data?.pages[currentPageIndex - 1]?.data ?? [];

  function handlePaginationChange(event: NonCancelableCustomEvent<PaginationProps.ChangeDetail>) {
    setCurrentPageIndex(event.detail.currentPageIndex);
  }

  return (
    <FluxCards<CategoryResult>
      columns={5}
      empty={<Empty header="No matches" />}
      itemMapper={(item) => {
        const href = interpolatePathname(Pathname.Game, { gameId: item.id });
        const imgSrc = item?.box_art_url.replace(/-\d+x\d+/g, `-${400}x${534}`);
        return <CategoryThumbnail imgSrc={imgSrc} href={href} title={item.name} />;
      }}
      items={items}
      loading={isFetching}
      pagination={
        <InfinitePagination
          data={data}
          currentPageIndex={currentPageIndex}
          onChange={handlePaginationChange}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
        />
      }
    />
  );
}

interface Props {
  query: string;
}
