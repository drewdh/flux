import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';

import RelativeTime from 'common/relative-time';
import { useGetStreamByUserLogin, useGetUsers } from '../../api/api';
import styles from './styles.module.scss';

export default function Details({ streamLogin }: DetailsProps) {
  // Viewer count seems to be updated every 60 seconds, so let's refetch that often
  const { data: streamData } = useGetStreamByUserLogin(streamLogin, { refetchInterval: 1000 * 60 });
  const { data: broadcasterData } = useGetUsers(
    { logins: [streamLogin!] },
    { enabled: !!streamLogin }
  );

  return (
    <Container>
      <SpaceBetween size="xs">
        <div className={styles.stats}>
          <b>{Number(streamData?.data[0]?.viewer_count ?? 0).toLocaleString()} viewers</b>
          {streamData?.data[0] && (
            <b>
              Started <RelativeTime date={streamData?.data[0]?.started_at} inline />
            </b>
          )}
          <div className={styles.tags}>
            {streamData?.data[0]?.tags?.map((tag) => (
              <Box color="text-body-secondary" display="inline">
                #{tag}
              </Box>
            ))}
          </div>
        </div>
        <span>{broadcasterData?.data[0].description}</span>
      </SpaceBetween>
    </Container>
  );
}

interface DetailsProps {
  streamLogin: string | undefined;
}
