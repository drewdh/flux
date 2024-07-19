import { useEffect, useState } from 'react';
import { PaginationProps } from '@cloudscape-design/components/pagination';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';
import Alert from '@cloudscape-design/components/alert';
import Button from '@cloudscape-design/components/button';

import { useSearchChannelsWithStreamData } from '../../api/api';
import Empty from 'common/empty/empty';
import InfinitePagination from 'common/infinite-pagination';
import VideoThumbnail from 'common/video-thumbnail';
import { useFeedback } from '../../feedback/feedback-context';
import FluxCards from 'common/cards';

export default function ChannelResults({ query }: Props) {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);
  const { setIsFeedbackVisible } = useFeedback();

  useEffect(() => {
    setCurrentPageIndex(1);
  }, [query]);

  const { hasNextPage, data, isFetching, isFetchingNextPage, isLoading, fetchNextPage, error } =
    useSearchChannelsWithStreamData({
      query,
      pageSize: 9,
    });

  const items = data?.pages[currentPageIndex - 1]?.data ?? [];

  function handlePaginationChange(event: NonCancelableCustomEvent<PaginationProps.ChangeDetail>) {
    setCurrentPageIndex(event.detail.currentPageIndex);
  }

  return (
    <FluxCards
      columns={3}
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
      invalid={!!error}
      itemMapper={(stream) => <VideoThumbnail stream={stream} isLive />}
      items={items}
      loading={isLoading || isFetching}
      loadingText="Loading live channels"
      minColumnWidth={250}
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
