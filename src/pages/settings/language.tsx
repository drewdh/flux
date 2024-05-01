import { useEffect, useMemo, useState } from 'react';
import Box from '@cloudscape-design/components/box';
import Popover from '@cloudscape-design/components/popover';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Select, { SelectProps } from '@cloudscape-design/components/select';
import { useTranslation } from 'react-i18next';

import { useSettings } from 'utilities/settings';
import styles from './styles.module.scss';

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
    <Container
      header={
        <Header
          description="Set your preferred language for the Flux interface."
          info={
            <Box display="inline" color="text-status-info">
              <Popover
                header="Beta feature"
                content="Setting your preferred language is in beta. Not all text has translations, and not all languages are supported."
              >
                <Box color="inherit" fontSize="body-s" fontWeight="bold">
                  Beta
                </Box>
              </Popover>
            </Box>
          }
        >
          {t('settings.language.title')}
        </Header>
      }
    >
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
