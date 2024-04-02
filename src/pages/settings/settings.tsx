import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

import FluxAppLayout from 'common/flux-app-layout';
import Theme from './theme';
import Language from './language';
import { useTranslation } from 'react-i18next';

export default function SettingsPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'settings' });

  return (
    <FluxAppLayout
      toolsHide
      content={
        <ContentLayout header={<Header variant="h1">{t('title')}</Header>}>
          <SpaceBetween size="l">
            <Theme />
            <Language />
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
