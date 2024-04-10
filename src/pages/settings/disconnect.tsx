import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';

export default function Disconnect() {
  return (
    <Container
      header={
        <Header description="Disconnect Flux from Twitch for all devices.">
          Disconnect Twitch
        </Header>
      }
      footer={
        <Box textAlign="center">
          <Link variant="primary" href="https://twitch.tv/settings/connections">
            Twitch settings
          </Link>
        </Box>
      }
    >
      <span>
        From Twitch settings, select <b>Connections</b>, scroll to Flux.watch in{' '}
        <b>Other Connections</b>, and select <b>Disconnect</b>.
      </span>
    </Container>
  );
}
