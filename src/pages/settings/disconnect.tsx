import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import Alert from '@cloudscape-design/components/alert';
import SpaceBetween from '@cloudscape-design/components/space-between';

export default function Disconnect() {
  return (
    <Container
      header={
        <Header description="Disconnect Flux from Twitch for all devices.">
          Disconnect Twitch
        </Header>
      }
    >
      <SpaceBetween size="l" direction="vertical">
        <Alert type="warning">
          Disconnecting Twitch will end all active sessions on your devices.
        </Alert>
        <span>
          From Twitch settings, select Connections, scroll to Flux.watch in Other Connections, and
          select Disconnect.{' '}
          <Link href="https://twitch.tv/settings/connections" external variant="primary">
            Twitch settings
          </Link>
        </span>
      </SpaceBetween>
    </Container>
  );
}
