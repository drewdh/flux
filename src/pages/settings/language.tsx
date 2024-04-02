import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Select from '@cloudscape-design/components/select';
import { useTranslation } from 'react-i18next';

import styles from './styles.module.scss';

export default function Language() {
  const { t } = useTranslation();

  return (
    <Container header={<Header>{t('settings.language.title')}</Header>}>
      <div className={styles.dropdownWrapper}>
        <Select
          disabled
          selectedOption={{ label: 'English' }}
          options={[{ value: '', label: 'English' }]}
        />
      </div>
    </Container>
  );
}
