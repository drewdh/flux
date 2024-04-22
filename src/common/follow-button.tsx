import Box from '@cloudscape-design/components/box';
import Popover from '@cloudscape-design/components/popover';
import Link from '@cloudscape-design/components/link';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { useGetFollowedChannels, useValidate } from '../api/api';

export default function FollowButton({ broadcasterId }: FollowButtonProps) {
  const { data: userData, isLoading: isLoadingValidate } = useValidate();
  const { data, isLoading: isLoadingFollowers } = useGetFollowedChannels({
    broadcaster_id: broadcasterId,
    user_id: userData?.user_id,
  });
  const isFollowing = data?.data?.length;
  const loading = isLoadingFollowers || isLoadingValidate;

  if (loading) {
    return null;
  }

  return (
    <Box color={isFollowing ? 'text-status-success' : 'text-status-inactive'} display="inline">
      <Popover
        size="medium"
        triggerType="text"
        content={
          <>
            <Box variant="p">
              To follow or unfollow a broadcaster, use the actions in the video player.{' '}
              <Link
                href="https://discuss.dev.twitch.com/t/deprecation-of-create-and-delete-follows-api-endpoints/32351"
                external
              >
                Learn more
              </Link>
            </Box>
          </>
        }
      >
        <StatusIndicator type={isFollowing ? 'success' : 'stopped'}>
          {isFollowing ? 'Following' : 'Not following'}
        </StatusIndicator>
      </Popover>
    </Box>
  );
}

interface FollowButtonProps {
  broadcasterId: string | undefined;
}
