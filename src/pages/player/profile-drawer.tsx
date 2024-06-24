import Drawer from '@cloudscape-design/components/drawer';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Icon from '@cloudscape-design/components/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBadgeCheck } from '@fortawesome/pro-solid-svg-icons';
import { format } from 'date-fns';

import { useGetChannelFollowers, useGetFollowedChannels, useGetUsers } from '../../api/api';
import { broadcasterTypeLabel } from '../channel/page';
import Avatar from 'common/avatar';
import DrawerFooter from 'common/drawer-footer';
import InternalLink from 'common/internal-link';
import { interpolatePathname, Pathname } from 'utilities/routes';
import { useParams } from 'react-router';

export default function ProfileDrawer({ userId }: Props) {
  const { user: broadcasterLogin } = useParams();
  const { isLoading: isLoadingBroadcaster, data: broadcasterResponseData } = useGetUsers(
    { logins: [broadcasterLogin!] },
    { enabled: !!broadcasterLogin }
  );
  const { isLoading: isLoadingUser, data: userResponseData } = useGetUsers(
    { ids: [userId!] },
    { enabled: !!userId }
  );
  const { isLoading: isLoadingFollowers, data: followerResponseData } = useGetChannelFollowers({
    broadcasterId: userId ?? '',
  });

  const broadcasterData = broadcasterResponseData?.data[0];
  const userData = userResponseData?.data[0];
  const followerCount = followerResponseData?.total ?? 0;

  const isLoading = isLoadingUser || isLoadingFollowers || isLoadingBroadcaster;

  function renderContent() {
    if (!userId) {
      return 'Click a profile to view more details.';
    }
    return (
      <div>
        <SpaceBetween size="l" direction="vertical">
          <div>
            <Box variant="awsui-key-label">Description</Box>
            <div>{userData?.description || '-'}</div>
          </div>
          <div>
            <Box variant="awsui-key-label">Broadcaster level</Box>
            <SpaceBetween size="xxs" direction="horizontal">
              {userData?.broadcaster_type === 'partner' && (
                <Icon svg={<FontAwesomeIcon icon={faBadgeCheck} color="#a970ff" />} />
              )}
              {broadcasterTypeLabel[userData?.broadcaster_type ?? ''] ?? 'None'}
            </SpaceBetween>
          </div>
          <div>
            <Box variant="awsui-key-label">Follower count</Box>
            <div>{followerCount.toLocaleString()}</div>
          </div>
          <div>
            <Box variant="awsui-key-label">Joined date</Box>
            <div>{format(userData?.created_at ?? '', 'MMMM d, yyyy')}</div>
          </div>
        </SpaceBetween>
        <DrawerFooter header="Learn more">
          <SpaceBetween size="xxs" direction="vertical">
            <InternalLink
              href={interpolatePathname(Pathname.Channel, { login: userData?.login ?? '' })}
            >
              Profile page
            </InternalLink>
            <Link href={`https://www.twitch.tv/${userData?.login}/about`} external>
              Twitch profile page
            </Link>
          </SpaceBetween>
        </DrawerFooter>
      </div>
    );
  }

  return (
    <Drawer
      header={
        <SpaceBetween size="xs" direction="horizontal">
          <Avatar userId={userId ?? ''} size="s" />
          <h2>{userData?.display_name}</h2>
        </SpaceBetween>
      }
      loading={isLoading}
      i18nStrings={{ loadingText: 'Loading profile' }}
    >
      {renderContent()}
    </Drawer>
  );
}

interface Props {
  userId: string | null;
}
