import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

import FluxAppLayout from 'common/flux-app-layout';
import Theme from './theme';
import Language from './language';

export default function SettingsPage() {
  return (
    <FluxAppLayout
      toolsHide
      content={
        <ContentLayout header={<Header variant="h1">Settings</Header>}>
          <SpaceBetween size="l">
            <Theme />
            <Language />
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
