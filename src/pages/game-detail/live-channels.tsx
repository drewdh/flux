import Alert from '@cloudscape-design/components/alert';
import Button from '@cloudscape-design/components/button';

import { useGetStreams } from '../../api/api';
import VideoThumbnail from 'common/video-thumbnail';
import { useFeedback } from '../../feedback/feedback-store';
import Empty from 'common/empty/empty';
import FluxCards from 'common/cards';
import { Stream } from '../../api/twitch-types';

export default function LiveChannels({ gameId }: LiveChannelsProps) {
  const { data, isLoading, isFetching, fetchNextPage, error } = useGetStreams(
    { gameIds: [gameId], type: 'live', pageSize: 28 },
    {
      enabled: !!gameId.length,
    }
  );
  const openFeedback = useFeedback((state) => state.openFeedback);

  return (
    <FluxCards<Stream>
      columns={4}
      empty={<Empty header="No live channels" />}
      error={
        <Alert
          type="error"
          header={error?.name}
          action={<Button onClick={openFeedback}>Send feedback</Button>}
        >
          {error?.message}
        </Alert>
      }
      fetchingNextPage={isFetching}
      invalid={!!error}
      itemMapper={(stream) => <VideoThumbnail stream={stream} live />}
      items={data?.pages?.flatMap((data) => data.data) ?? []}
      loading={isLoading}
      loadingText="Loading live channels"
      minColumnWidth={250}
      onLastItemVisible={() => fetchNextPage()}
    />
  );
}

export interface LiveChannelsProps {
  gameId: string;
}
