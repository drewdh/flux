import Pagination, { PaginationProps } from '@cloudscape-design/components/pagination';
import { InfiniteData } from '@tanstack/react-query';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';

export default function InfinitePagination<T = unknown>({
  currentPageIndex,
  data,
  onChange,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
}: Props<T>) {
  function handleNextPageClick(event: NonCancelableCustomEvent<PaginationProps.PageClickDetail>) {
    const { requestedPageAvailable } = event.detail;
    if (!requestedPageAvailable && hasNextPage) {
      fetchNextPage();
    }
  }

  return (
    <Pagination
      currentPageIndex={currentPageIndex}
      disabled={isFetchingNextPage}
      onChange={onChange}
      onNextPageClick={handleNextPageClick}
      openEnd={hasNextPage}
      pagesCount={data?.pages.length ?? 1}
    />
  );
}

interface Props<T> {
  currentPageIndex: number;
  onChange: (event: NonCancelableCustomEvent<PaginationProps.ChangeDetail>) => void;
  data: InfiniteData<T> | undefined;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}
