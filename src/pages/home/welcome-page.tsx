import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';

import FluxAppLayout from 'common/flux-app-layout';
import FullHeightContent from 'common/full-height-content';
import { connectHref } from '../../constants';
import SignedOutModal from './signed-out-modal';

export default function WelcomePage() {
  return (
    <FluxAppLayout
      maxContentWidth={1040}
      toolsHide
      content={
        <FullHeightContent>
          <div>
            <Box fontSize="display-l" fontWeight="bold">
              Flux
            </Box>
            <Box margin={{ top: 'xl', bottom: 's' }} variant="h1">
              Experience Twitch in a new, easy-to-use design.
            </Box>
            <Box margin={{ top: 'xxl', bottom: 's' }}>
              <Button href={connectHref} variant="primary">
                Sign in with Twitch
              </Button>
            </Box>
          </div>
          <SignedOutModal />
        </FullHeightContent>
      }
    />
  );
}
