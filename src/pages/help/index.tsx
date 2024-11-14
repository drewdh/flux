import FluxAppLayout from 'common/flux-app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';

export default function HelpPage() {
  return (
    <FluxAppLayout
      navigationHide
      toolsHide
      maxContentWidth={700}
      content={
        <ContentLayout header={<Header variant="h1">Help</Header>}>
          <SpaceBetween size="l">
            <div>
              <Header variant="h3">How does Flux use my information?</Header>
              <Box variant="p">
                Flux uses only the information you authorized to share when you connected to Twitch.
                This information is used to analyze site usage. Your information is never shared
                with third parties.
              </Box>
            </div>
            <div>
              <Header variant="h3">How do I remove Flux from my Twitch account?</Header>
              <Box variant="p">
                If you no longer want to use Flux, you can remove the <b>Flux.watch</b> connection
                in your Twitch settings.
              </Box>
            </div>
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
