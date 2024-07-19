import Alert from '@cloudscape-design/components/alert';
import Button from '@cloudscape-design/components/button';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import { spaceScaledL } from '@cloudscape-design/design-tokens';
import { useState } from 'react';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';
import { PaginationProps } from '@cloudscape-design/components/pagination';

import FlexibleColumnLayout from 'common/flexible-column-layout';
import { useGetStreams } from '../../api/api';
import VideoThumbnail from 'common/video-thumbnail';
import { useFeedback } from '../../feedback/feedback-context';
import Empty from 'common/empty/empty';
import useCounter from 'utilities/use-counter';
import InfinitePagination from 'common/infinite-pagination';
import CardsHeader from 'common/cards-header';

export default function LiveChannels({ gameId }: LiveChannelsProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);
  const { data, isLoading, isFetching, fetchNextPage, isFetchingNextPage, hasNextPage, error } =
    useGetStreams({ gameIds: [gameId], type: 'live', pageSize: 12 }, { enabled: !!gameId.length });
  const { setIsFeedbackVisible } = useFeedback();
  const totalCount = data?.pages.flatMap((page) => page.data).length ?? 0;
  const counter = useCounter({
    count: totalCount,
    isLoading,
    isOpenEnd: hasNextPage,
  });

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
      <FlexibleColumnLayout columns={4} minColumnWidth={250}>
        {data?.pages[currentPageIndex - 1].data.map((stream) => (
          <VideoThumbnail isLive stream={stream} />
        ))}
      </FlexibleColumnLayout>
    );
  }

  return (
    // Using a custom div instead of SpaceBetween so sticky works correctly
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: spaceScaledL }}>
      <CardsHeader sticky>
        <Header
          counter={counter}
          actions={
            <InfinitePagination
              currentPageIndex={currentPageIndex}
              onChange={handlePaginationChange}
              data={data}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          }
        >
          Live channels
        </Header>
      </CardsHeader>
      {renderContent()}
    </div>
  );
}

export interface LiveChannelsProps {
  gameId: string;
}
