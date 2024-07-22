import Alert from '@cloudscape-design/components/alert';
import Button from '@cloudscape-design/components/button';

import { useSearchChannelsWithStreamData } from '../../api/api';
import Empty from 'common/empty/empty';
import VideoThumbnail from 'common/video-thumbnail';
import { useFeedback } from '../../feedback/feedback-context';
import FluxCards from 'common/cards';

export default function ChannelResults({ query }: Props) {
  const { setIsFeedbackVisible } = useFeedback();

  const { data, isFetchingNextPage, isLoading, fetchNextPage, error } =
    useSearchChannelsWithStreamData({
      query,
      pageSize: 9,
    });

  const items = data?.pages.flatMap((page) => page.data) ?? [];

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
      fetchingNextPage={isFetchingNextPage}
      invalid={!!error}
      itemMapper={(stream) => <VideoThumbnail stream={stream} isLive />}
      items={items}
      loading={isLoading}
      loadingText="Loading live channels"
      onLastItemVisible={() => fetchNextPage()}
      minColumnWidth={250}
    />
  );
}

interface Props {
  query: string;
}
