import Box from '@cloudscape-design/components/box';
import { useEffect, useState } from 'react';

import FluxAppLayout from 'common/flux-app-layout';
import useTitle from 'utilities/use-title';
import { topNavId } from '../top-navigation/constants';

export default function NotFoundPage() {
  useTitle('Page not found - Flux');
  const [navHeight, setNavHeight] = useState<number>(0);

  useEffect(() => {
    const navObserver = new ResizeObserver((entries) => {
      setNavHeight(entries[0].contentRect.height);
    });
    navObserver.observe(document.getElementById(topNavId)!);
    return () => navObserver.disconnect();
  }, [navHeight]);

  return (
    <FluxAppLayout
      maxContentWidth={350}
      toolsHide
      disableContentPaddings
      navigationHide
      content={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: `calc(100vh - ${navHeight}px)`,
          }}
        >
          <Box fontWeight="bold" fontSize="heading-xl">
            This page does not exist.
          </Box>
        </div>
      }
    />
  );
}
