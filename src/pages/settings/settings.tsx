import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

import FluxAppLayout from 'common/flux-app-layout';
import Language from './language';
import { useTranslation } from 'react-i18next';
import Disconnect from './disconnect';
import useTitle from 'utilities/use-title';

export default function SettingsPage() {
  useTitle('Settings - Flux');
  const { t } = useTranslation('translation', { keyPrefix: 'settings' });

  return (
    <FluxAppLayout
      toolsHide
      maxContentWidth={700}
      content={
        <SpaceBetween size="m">
          <Header variant="h1" description="Edit Flux settings for this browser.">
            {t('title')}
          </Header>
          <SpaceBetween size="l">
            <Language />
            <Disconnect />
          </SpaceBetween>
        </SpaceBetween>
      }
    />
  );
}
