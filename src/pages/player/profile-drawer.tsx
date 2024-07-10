import Drawer from '@cloudscape-design/components/drawer';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Icon from '@cloudscape-design/components/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBadgeCheck } from '@fortawesome/pro-solid-svg-icons';
import { format } from 'date-fns';

import { useGetChannelFollowers, useGetUsers } from '../../api/api';
import { broadcasterTypeLabel } from '../channel/page';
import Avatar from 'common/avatar';
import DrawerFooter from 'common/drawer-footer';
import InternalLink from 'common/internal-link';
import { interpolatePathname, Pathname } from 'utilities/routes';

export default function ProfileDrawer({ userId }: Props) {
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

  function renderContent() {
    if (!userId) {
      return 'Click a profile to view more details.';
    }
    return (
      <div>
        <KeyValuePairs
          items={[
            {
              label: 'Description',
              value: userData?.description || '-',
            },
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
          ]}
        />
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
