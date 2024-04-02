import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import RadioGroup, { RadioGroupProps } from '@cloudscape-design/components/radio-group';
import { useTranslation } from 'react-i18next';

import { Appearance, useSettings } from 'utilities/settings';

export default function Theme() {
  const { t } = useTranslation();
  const { appearance, setAppearance } = useSettings();

  const options: RadioGroupProps.RadioButtonDefinition[] = [
    { value: Appearance.Light, label: t('settings.appearance.light') },
    { value: Appearance.Dark, label: t('settings.appearance.dark') },
    { value: Appearance.System, label: t('settings.appearance.system') },
  ];

  const selectedOption = options.find((option) => option.value === appearance)?.value ?? null;

  return (
    <Container header={<Header>{t('settings.appearance.title')}</Header>}>
      <RadioGroup
        ariaLabel={t('settings.appearance.title')}
        onChange={(event) => setAppearance(event.detail.value as Appearance)}
        items={options}
        value={selectedOption}
      />
    </Container>
  );
}
