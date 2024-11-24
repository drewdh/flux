import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import Box from '@cloudscape-design/components/box';
import Modal from '@cloudscape-design/components/modal';
import TextContent from '@cloudscape-design/components/text-content';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';

import { connectHref } from '../../constants';

export default function SignedOutModal() {
  const [visible, setVisible] = useState<boolean>(false);
  const { state } = useLocation();

  useEffect(() => {
    if (state?.tokenInvalid) {
      setVisible(true);
    }
  }, [state]);

  return (
    <Modal
      header="Signed out"
      footer={
        <Box float="right">
          <SpaceBetween size="xs" direction="horizontal">
            <Button variant="link" onClick={() => setVisible(false)}>
              Cancel
            </Button>
            <Button href={connectHref} variant="primary">
              Sign in with Twitch
            </Button>
          </SpaceBetween>
        </Box>
      }
      visible={visible}
      onDismiss={() => setVisible(false)}
    >
      <TextContent>
        <p>You’ve been signed out. To use Flux, sign in again with Twitch.</p>
      </TextContent>
    </Modal>
  );
}
