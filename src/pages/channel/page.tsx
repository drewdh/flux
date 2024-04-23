import ContentLayout from '@cloudscape-design/components/content-layout';
import { useNavigate, useParams } from 'react-router';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Tabs from '@cloudscape-design/components/tabs';
import { format } from 'date-fns';
import Box from '@cloudscape-design/components/box';
import { useEffect, useState } from 'react';
import ColumnLayout from '@cloudscape-design/components/column-layout';

import FluxAppLayout from 'common/flux-app-layout';
import { useGetChannelFollowers, useGetUsers } from '../../api/api';
import FullHeightContent from 'common/full-height-content';
import Avatar from 'common/avatar/avatar';
import useTitle from 'utilities/use-title';
import { interpolatePathname, Pathname } from 'utilities/routes';
import styles from './styles.module.scss';

enum TabId {
  Details = 'details',
}
const broadcasterTypeLabel: Record<string, string> = {
  affiliate: 'Affiliate',
  partner: 'Partner',
};
const userTypeLabel: Record<string, string> = {
  admin: 'Twitch administrator',
  global_mod: 'Global moderator',
  staff: 'Twitch staff',
};

const defaultTabId = TabId.Details;

export default function ChannelPage() {
  const { login = '', tabId } = useParams();
  const navigate = useNavigate();
  const [activeTabId, setActiveTabId] = useState<TabId>((tabId as TabId) ?? defaultTabId);
  const {
    data: userData,
    isLoading: isLoadingUser,
    isError,
  } = useGetUsers({ logins: [login!] }, { enabled: !!login });
  const { data: followerData, isLoading: isLoadingFollowers } = useGetChannelFollowers({
    broadcasterId: userData?.data[0].id,
  });
  useTitle(`${userData?.data[0].display_name ?? login} - Flux`);

  // Let tab id route param be source of truth
  useEffect(() => {
    setActiveTabId((tabId as TabId) ?? defaultTabId);
  }, [tabId]);

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
                </SpaceBetween>
              </div>
            }
          >
            <Tabs
              onChange={(event) => {
                const { activeTabHref, activeTabId: newActiveTabId } = event.detail;
                if (activeTabHref) {
                  navigate(activeTabHref);
                } else {
                  setActiveTabId(newActiveTabId as TabId);
                }
              }}
              activeTabId={activeTabId}
              tabs={[
                {
                  id: TabId.Details,
                  label: 'Details',
                  href: interpolatePathname(Pathname.Channel, { login, tabId: TabId.Details }),
                  content: (
                    <ColumnLayout columns={4} variant="text-grid">
                      <div>
                        <Box variant="awsui-key-label">Broadcaster level</Box>
                        <div>
                          {broadcasterTypeLabel[userData?.data[0].broadcaster_type ?? ''] ?? '-'}
                        </div>
                      </div>
                      <div>
                        <Box variant="awsui-key-label">Followers</Box>
                        <div>
                          {Number(followerData?.total ?? 0).toLocaleString()} follower
                          {followerData?.total === 1 ? '' : 's'}
                        </div>
                      </div>
                      <div>
                        <Box variant="awsui-key-label">Created date</Box>
                        <div>
                          Joined {format(userData?.data[0].created_at ?? '', 'MMMM d, yyyy')}
                        </div>
                      </div>
                      <div>
                        <Box variant="awsui-key-label">Twitch staff mod role</Box>
                        <div>{userTypeLabel[userData?.data[0].type ?? ''] ?? '-'}</div>
                      </div>
                      <div>
                        <Box variant="awsui-key-label">User login</Box>
                        <div>{userData?.data[0].login}</div>
                      </div>
                      <div>
                        <Box variant="awsui-key-label">User ID</Box>
                        <div>{userData?.data[0].id}</div>
                      </div>
                    </ColumnLayout>
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
