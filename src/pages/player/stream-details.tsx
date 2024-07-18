import Container from '@cloudscape-design/components/container';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Header from '@cloudscape-design/components/header';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';
import Alert from '@cloudscape-design/components/alert';
import ExpandableSection from '@cloudscape-design/components/expandable-section';

import { useGetFollowedChannels, useGetStreams, useValidate } from '../../api/api';
import InternalLink from 'common/internal-link';
import { interpolatePathname, Pathname } from 'utilities/routes';
import RelativeTime from 'common/relative-time';
import Empty from 'common/empty/empty';
import { useFeedback } from '../../feedback/feedback-context';

const languageLabelMap: Record<string, string> = {
  en: 'English',
  de: 'German',
  es: 'Spanish',
  pt: 'Portuguese',
  it: 'Italian',
  ar: 'Arabic',
  hu: 'Hungarian',
  fr: 'French',
  ru: 'Russian',
  other: 'Other',
};

export default function StreamDetails({ broadcasterUserId }: StreamDetailsProps) {
  const { data: userData } = useValidate();
  const {
    data: _streamData,
    isLoading,
    error,
  } = useGetStreams({ userIds: [broadcasterUserId!] }, { enabled: !!broadcasterUserId });
  const streamData = _streamData?.pages[0].data[0];
  const { setIsFeedbackVisible } = useFeedback();
  const { data: _followData } = useGetFollowedChannels({
    user_id: userData?.user_id,
    broadcaster_id: broadcasterUserId,
  });
  const followData = _followData?.data[0];

  if (!broadcasterUserId) {
    return null;
  }

  if (isLoading) {
    return (
      <Container>
        <Box textAlign="center" padding={{ vertical: 'xxxl' }}>
          <StatusIndicator type="loading">Loading details</StatusIndicator>
        </Box>
      </Container>
    );
  }

  if (streamData && streamData.type !== 'live') {
    return (
      <Container>
        <Box textAlign="center" padding={{ vertical: 'xxxl' }}>
          <Empty header="Stream offline" message="This streamer is no longer online." />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert type="error" header="Failed to load details">
          <SpaceBetween size="m">
            <div>
              Reload the page or try again later.{' '}
              <Link
                href="#"
                onFollow={(e) => {
                  e.preventDefault();
                  setIsFeedbackVisible(true);
                }}
                variant="primary"
              >
                Send feedback
              </Link>{' '}
              and share more details.
            </div>
            <ExpandableSection headerText="Error details">
              <div style={{ overflow: 'auto' }}>
                <Box variant="pre">{JSON.stringify(error, null, 2)}</Box>
              </div>
            </ExpandableSection>
          </SpaceBetween>
        </Alert>
      </Container>
    );
  }

  const gameHref = interpolatePathname(Pathname.Game, { gameId: streamData?.game_id ?? '' });

  return (
    <Container header={<Header variant="h2">Information</Header>}>
      <KeyValuePairs
        columns={2}
        items={[
          {
            type: 'group',
            items: [
              {
                label: 'Category',
                value:
                  streamData?.game_id && streamData.game_name ? (
                    <InternalLink variant="primary" href={gameHref}>
                      {streamData.game_name}
                    </InternalLink>
                  ) : (
                    '-'
                  ),
              },
              {
                label: 'Started',
                value: streamData?.started_at ? <RelativeTime date={streamData.started_at} /> : '-',
              },
              {
                label: 'Viewers',
                value: streamData?.viewer_count.toLocaleString() ?? '-',
              },
            ],
          },
          {
            type: 'group',
            items: [
              {
                label: 'Followed',
                value: followData?.followed_at ? (
                  <RelativeTime date={followData.followed_at} />
                ) : (
                  '-'
                ),
              },
              {
                label: 'Tags',
                value: streamData?.tags?.join(', ') ?? '-',
              },
              {
                label: 'Language',
                value: languageLabelMap[streamData?.language ?? ''] ?? streamData?.language ?? '-',
              },
            ],
          },
        ]}
      />
    </Container>
  );
}

interface StreamDetailsProps {
  broadcasterUserId: string | undefined;
}
