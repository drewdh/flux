import ContentLayout from '@cloudscape-design/components/content-layout';
import { useNavigate, useParams } from 'react-router';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Tabs, { TabsProps } from '@cloudscape-design/components/tabs';

import FluxAppLayout from 'common/flux-app-layout';
import { useGetChannelFollowers, useGetUsers } from '../../api/api';
import FullHeightContent from 'common/full-height-content';
import Avatar from 'common/avatar/avatar';
import Box from '@cloudscape-design/components/box';
import useTitle from 'utilities/use-title';
import { useEffect, useState } from 'react';
import { interpolatePathname, Pathname } from 'utilities/routes';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import { format } from 'date-fns';

enum TabId {
  Details = 'details',
}

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
      content={
        loading ? (
          <FullHeightContent>
            <StatusIndicator type="loading">Loading channel</StatusIndicator>
          </FullHeightContent>
        ) : (
          <ContentLayout
            header={
              <SpaceBetween size="s" direction="horizontal" alignItems="center">
                <Avatar userId={userData?.data[0].id ?? ''} size="l" />
                <SpaceBetween size="xs">
                  <Box fontSize="display-l" fontWeight="bold">
                    {login}
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
                  <Box color="text-body-secondary">{userData?.data[0].description}</Box>
                </SpaceBetween>
              </SpaceBetween>
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
