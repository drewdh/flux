import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import RadioGroup, { RadioGroupProps } from '@cloudscape-design/components/radio-group';

import { Appearance, useSettings } from 'utilities/settings';

export default function Theme() {
  const { appearance, setAppearance } = useSettings();

  const options: RadioGroupProps.RadioButtonDefinition[] = [
    { value: Appearance.Light, label: 'Light' },
    { value: Appearance.Dark, label: 'Dark' },
    { value: Appearance.System, label: 'Use system settings' },
  ];

  const selectedOption = options.find((option) => option.value === appearance)?.value ?? null;

  return (
    <Container header={<Header>Appearance</Header>}>
      <RadioGroup
        ariaLabel="Appearance"
        onChange={(event) => setAppearance(event.detail.value as Appearance)}
        items={options}
        value={selectedOption}
      />
    </Container>
  );
}
