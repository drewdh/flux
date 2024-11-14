import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useTranslation } from 'react-i18next';

import FluxAppLayout from 'common/flux-app-layout';
import useTitle from 'utilities/use-title';
import Appearance from './appearance';

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
            <Appearance />
            {/* Most strings aren't translated, so let's not even show this for now. */}
            {/*<Language />*/}
          </SpaceBetween>
        </SpaceBetween>
      }
    />
  );
}
