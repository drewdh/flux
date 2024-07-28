import ContentLayout from '@cloudscape-design/components/content-layout';
import { useParams } from 'react-router';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Tabs from '@cloudscape-design/components/tabs';
import { format } from 'date-fns';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';

import FluxAppLayout from 'common/flux-app-layout';
import { useGetChannelFollowers, useGetUsers } from '../../api/api';
import FullHeightContent from 'common/full-height-content';
import Avatar from 'common/avatar';
import useTitle from 'utilities/use-title';
import { interpolatePathname, Pathname } from 'utilities/routes';
import styles from './styles.module.scss';
import useNavigableTabs from 'utilities/use-navigable-tabs';

enum TabId {
  Details = 'details',
}
export const broadcasterTypeLabel: Record<string, string> = {
  affiliate: 'Affiliate',
  partner: 'Partner',
};

const defaultTabId = TabId.Details;

export default function ChannelPage() {
  const { login = '' } = useParams();
  const { activeTabId, handleChange: handleTabsChange } = useNavigableTabs({
    defaultTabId: defaultTabId,
    searchParamKey: 'tabId',
  });
  const { data: userData, isLoading: isLoadingUser } = useGetUsers(
    { logins: [login!] },
    { enabled: !!login }
  );
  const { data: followerData, isLoading: isLoadingFollowers } = useGetChannelFollowers({
    broadcasterId: userData?.data[0].id,
  });
  useTitle(`${userData?.data[0].display_name ?? login} - Flux`);

  const loading = isLoadingUser || isLoadingFollowers;

  return (
    <FluxAppLayout
      toolsHide
      navigationHide
      maxContentWidth={1300}
      content={
        loading ? (
          <FullHeightContent>
            <StatusIndicator type="loading">Loading channel</StatusIndicator>
          </FullHeightContent>
        ) : (
          <ContentLayout
            disableOverlap
            header={
              <div className={styles.header}>
                <Avatar userId={userData?.data[0].id ?? ''} size="l" />
                <SpaceBetween size="xs">
                  <Box fontSize="display-l" fontWeight="bold">
                    {userData?.data[0].display_name}
                  </Box>
                  <Box color="text-body-secondary">
                    <SpaceBetween size="s" direction="horizontal">
                      <span>
                        {Number(followerData?.total ?? 0).toLocaleString(undefined, {
                          notation: 'compact',
                        })}{' '}
                        follower{followerData?.total === 1 ? '' : 's'}
                      </span>
                    </SpaceBetween>
                  </Box>
                  <div className={styles.longText}>
                    <Box color="text-body-secondary">{userData?.data[0].description}</Box>
                  </div>
                  <Box margin={{ top: 's' }}>
                    <Button
                      variant="normal"
                      href={`https://www.twitch.tv/${userData?.data[0].login}/about`}
                      target="_blank"
                      iconName="external"
                      iconAlign="right"
                    >
                      Learn more
                    </Button>
                  </Box>
                </SpaceBetween>
              </div>
            }
          >
            <Tabs
              onChange={handleTabsChange}
              activeTabId={activeTabId}
              tabs={[
                {
                  id: TabId.Details,
                  label: 'Details',
                  href: interpolatePathname(Pathname.Profile, { login, tabId: TabId.Details }),
                  content: (
                    <KeyValuePairs
                      columns={4}
                      items={[
                        {
                          label: 'Broadcaster level',
                          value:
                            broadcasterTypeLabel[userData?.data[0].broadcaster_type ?? ''] ?? '-',
                        },
                        {
                          label: 'Followers',
                          value: `${Number(followerData?.total ?? 0).toLocaleString()} follower${
                            followerData?.total === 1 ? '' : 's'
                          }`,
                        },
                        {
                          label: 'Created date',
                          value: format(userData?.data[0].created_at ?? '', 'MMMM d, yyyy'),
                        },
                        {
                          label: 'User login',
                          value: userData?.data[0].login,
                        },
                        {
                          label: 'User ID',
                          value: userData?.data[0].id,
                        },
                      ]}
                    />
                  ),
                },
              ]}
            />
          </ContentLayout>
        )
      }
    />
  );
}
