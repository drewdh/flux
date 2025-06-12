import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import RadioGroup, { RadioGroupProps } from '@cloudscape-design/components/radio-group';

import { Appearance as IAppearance, useSettings } from 'utilities/settings';

const items: RadioGroupProps.RadioButtonDefinition[] = [
  {
    value: IAppearance.Light,
    label: 'Light',
  },
  {
    value: IAppearance.Dark,
    label: 'Dark',
  },
  {
    value: IAppearance.System,
    label: 'System default',
  },
];

export default function Appearance() {
  const { appearance, setAppearance } = useSettings();

  return (
    <Container header={<Header>Appearance</Header>}>
      <RadioGroup
        onChange={(e) => setAppearance(e.detail.value as IAppearance)}
        value={appearance}
        items={items}
      />
    </Container>
  );
}
