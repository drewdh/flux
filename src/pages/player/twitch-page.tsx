import { useEffect, useRef, useState } from 'react';

import DhAppLayout from 'common/flux-app-layout';
import TwitchComponent from './twitch';
import ProfileDrawer from './profile-drawer';
import { useParams } from 'react-router';
import { useGetUsers } from '../../api/api';

const viewportBreakpointXs = 688;
const profileDrawerId = 'profile';

export default function TwitchPage() {
  const { user } = useParams();
  const { data: usersData } = useGetUsers({ logins: [user!] }, { enabled: !!user });
  const broadcasterId = usersData?.data[0].id ?? null;
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(broadcasterId);
  const ref = useRef<HTMLDivElement>(null);
  const [disableContentPaddings, setDisableContentPaddings] = useState<boolean>(false);

  // Load broadcaster profile by default
  useEffect(() => {
    if (broadcasterId && !selectedUserId) {
      setSelectedUserId(broadcasterId);
    }
  }, [selectedUserId, broadcasterId]);

  useEffect(() => {
    const refCurrent = ref.current;
    if (!refCurrent) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setDisableContentPaddings(width < viewportBreakpointXs);
    });
    resizeObserver.observe(refCurrent);
    return () => resizeObserver.unobserve(refCurrent);
  }, []);

  return (
    <div ref={ref}>
      <DhAppLayout
        activeDrawerId={activeDrawerId}
        toolsHide
        drawers={[
          {
            id: profileDrawerId,
            content: <ProfileDrawer userId={selectedUserId} />,
            trigger: {
              iconName: 'user-profile',
            },
            ariaLabels: {
              drawerName: 'Profile details',
            },
          },
        ]}
        disableContentPaddings={disableContentPaddings}
        maxContentWidth={1700}
        onDrawerChange={(event) => setActiveDrawerId(event.detail.activeDrawerId)}
        contentType="wizard"
        content={
          <TwitchComponent
            onUserIdChange={(userId) => {
              setSelectedUserId(userId);
              setActiveDrawerId(profileDrawerId);
            }}
          />
        }
      />
    </div>
  );
}
