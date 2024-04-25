import FlexibleColumnLayout from 'common/flexible-column-layout';
import { useGetStreams } from '../../api/api';
import VideoThumbnail from 'common/video-thumbnail';

export default function LiveChannels({ gameId }: LiveChannelsProps) {
  const { data } = useGetStreams({ gameIds: [gameId], type: 'live' }, { enabled: !!gameId.length });

  return (
    <FlexibleColumnLayout columns={4} minColumnWidth={250}>
      {data?.data.map((stream) => <VideoThumbnail size="s" stream={stream} />)}
    </FlexibleColumnLayout>
  );
}

export interface LiveChannelsProps {
  gameId: string;
}
