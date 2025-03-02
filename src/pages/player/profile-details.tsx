import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Icon from '@cloudscape-design/components/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBadgeCheck } from '@fortawesome/pro-solid-svg-icons';
import { format } from 'date-fns';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { useGetChannelFollowers, useGetUsers } from '../../api/api';
import { broadcasterTypeLabel } from '../channel/page';

export default function ProfileDetails({ userId }: Props) {
  const { isLoading: isLoadingUser, data: userResponseData } = useGetUsers(
    { ids: [userId!] },
    { enabled: !!userId }
  );
  const { isLoading: isLoadingFollowers, data: followerResponseData } = useGetChannelFollowers({
    broadcasterId: userId ?? '',
  });

  const userData = userResponseData?.data[0];
  const followerCount = followerResponseData?.total ?? 0;

  const isLoading = isLoadingUser || isLoadingFollowers;

  return (
    <Container header={<Header description={userData?.description}>Profile</Header>}>
      {isLoading && <StatusIndicator type="loading">Loading profile</StatusIndicator>}
      {userData && followerResponseData && (
        <KeyValuePairs
          columns={4}
          items={[
            {
              label: 'Broadcaster level',
              value: (
                <SpaceBetween size="xxs" direction="horizontal">
                  {userData?.broadcaster_type === 'partner' && (
                    <Icon svg={<FontAwesomeIcon icon={faBadgeCheck} color="#a970ff" />} />
                  )}
                  {broadcasterTypeLabel[userData?.broadcaster_type ?? ''] ?? 'None'}
                </SpaceBetween>
              ),
            },
            {
              label: 'Follower count',
              value: followerCount.toLocaleString(),
            },
            {
              label: 'Joined date',
              value: format(userData?.created_at ?? '', 'MMMM d, yyyy'),
            },
            {
              label: 'Twitch profile',
              value: (
                <Link href={`https://www.twitch.tv/${userData?.login}/about`} external>
                  Twitch profile
                </Link>
              ),
            },
          ]}
        />
      )}
    </Container>
  );
}

interface Props {
  userId: string | undefined;
}
