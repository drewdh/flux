import Alert from '@cloudscape-design/components/alert';
import Button from '@cloudscape-design/components/button';
import { useState } from 'react';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';
import { PaginationProps } from '@cloudscape-design/components/pagination';

import { useGetStreams } from '../../api/api';
import VideoThumbnail from 'common/video-thumbnail';
import { useFeedback } from '../../feedback/feedback-context';
import Empty from 'common/empty/empty';
import InfinitePagination from 'common/infinite-pagination';
import FluxCards from 'common/cards';
import { Stream } from '../../api/twitch-types';

export default function LiveChannels({ gameId }: LiveChannelsProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);
  const { data, isLoading, isFetching, fetchNextPage, isFetchingNextPage, hasNextPage, error } =
    useGetStreams({ gameIds: [gameId], type: 'live', pageSize: 12 }, { enabled: !!gameId.length });
  const { setIsFeedbackVisible } = useFeedback();

  function handlePaginationChange(event: NonCancelableCustomEvent<PaginationProps.ChangeDetail>) {
    setCurrentPageIndex(event.detail.currentPageIndex);
  }

  return (
    <FluxCards<Stream>
      columns={4}
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
      items={data?.pages[currentPageIndex - 1]?.data ?? []}
      loading={isLoading || isFetching}
      loadingText="Loading live channels"
      minColumnWidth={250}
      pagination={
        <InfinitePagination
          currentPageIndex={currentPageIndex}
          onChange={handlePaginationChange}
          data={data}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      }
    />
  );
}

export interface LiveChannelsProps {
  gameId: string;
}
