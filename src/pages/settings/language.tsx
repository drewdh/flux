import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Select, { SelectProps } from '@cloudscape-design/components/select';
import { useTranslation } from 'react-i18next';

import { useSettings } from 'utilities/settings';
import styles from './styles.module.scss';
import { useEffect, useMemo, useState } from 'react';

export default function Language() {
  const { t, i18n } = useTranslation();
  const options = useMemo(
    (): SelectProps.Option[] => [
      { value: '', label: t('settings.language.system') },
      { value: 'en-US', label: 'English (US)' },
      { value: 'de', label: 'Deutsch' },
    ],
    [t]
  );

  const { language, setLanguage } = useSettings();
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option | null>(() => {
    return options.find((option) => option.value === language) ?? null;
  });

  // Reselect selected option if language changes so selected option shows correct translation
  useEffect(() => {
    setSelectedOption(options.find((option) => option.value === language)!);
  }, [i18n.language, language, options]);

  return (
    <Container header={<Header>{t('settings.language.title')}</Header>}>
      <div className={styles.dropdownWrapper}>
        <Select
          onChange={(event) => {
            setSelectedOption(event.detail.selectedOption);
            setLanguage(event.detail.selectedOption.value ?? '');
          }}
          selectedOption={selectedOption}
          options={options}
        />
      </div>
    </Container>
  );
}
