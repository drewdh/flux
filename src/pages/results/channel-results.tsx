import { useEffect, useState } from 'react';
import { PaginationProps } from '@cloudscape-design/components/pagination';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';
import Box from '@cloudscape-design/components/box';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Alert from '@cloudscape-design/components/alert';
import Button from '@cloudscape-design/components/button';
import { spaceScaledL } from '@cloudscape-design/design-tokens';

import { useSearchChannelsWithStreamData } from '../../api/api';
import useCounter from 'utilities/use-counter';
import Empty from 'common/empty/empty';
import InfinitePagination from 'common/infinite-pagination';
import FlexibleColumnLayout from 'common/flexible-column-layout';
import VideoThumbnail from 'common/video-thumbnail';
import { useFeedback } from '../../feedback/feedback-context';

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

  const totalCount = data?.pages.flatMap((page) => page.data).length ?? 0;
  const counter = useCounter({
    count: totalCount,
    isOpenEnd: hasNextPage,
    isLoading: isLoading,
  });

  const items = data?.pages[currentPageIndex - 1]?.data ?? [];

  function handlePaginationChange(event: NonCancelableCustomEvent<PaginationProps.ChangeDetail>) {
    setCurrentPageIndex(event.detail.currentPageIndex);
  }

  function renderContent() {
    if (isLoading || isFetching) {
      return (
        <Box textAlign="center">
          <StatusIndicator type="loading">Loading live channels</StatusIndicator>
        </Box>
      );
    }

    if (totalCount === 0) {
      return (
        <Box textAlign="center">
          <Empty header="No live channels" />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert
          type="error"
          header={error?.name}
          action={<Button onClick={() => setIsFeedbackVisible(true)}>Send feedback</Button>}
        >
          {error?.message}
        </Alert>
      );
    }

    return (
      <FlexibleColumnLayout columns={3} minColumnWidth={250}>
        {items.map((stream) => (
          <VideoThumbnail isLive stream={stream} />
        ))}
      </FlexibleColumnLayout>
    );
  }

  return (
    // Using a custom div instead of SpaceBetween so sticky works correctly
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: spaceScaledL }}>
      {renderContent()}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <InfinitePagination
          data={data}
          currentPageIndex={currentPageIndex}
          onChange={handlePaginationChange}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
        />
      </div>
    </div>
  );
}

interface Props {
  query: string;
}
