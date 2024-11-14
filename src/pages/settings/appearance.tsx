import { useState } from 'react';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import FormField from '@cloudscape-design/components/form-field';
import Header from '@cloudscape-design/components/header';
import Modal from '@cloudscape-design/components/modal';
import RadioGroup, { RadioGroupProps } from '@cloudscape-design/components/radio-group';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { Appearance as IAppearance, useSettings } from 'utilities/settings';

const appearanceLabels: Record<IAppearance, string> = {
  [IAppearance.Dark]: 'Dark',
  [IAppearance.Light]: 'Light',
  [IAppearance.System]: 'Use system settings',
};

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
    label: 'Use system settings',
  },
];

export default function Appearance() {
  const { appearance, setAppearance } = useSettings();
  const [tempAppearance, setTempAppearance] = useState<IAppearance>(appearance);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  function dismissModal() {
    setModalVisible(false);
  }

  function handleSave() {
    setAppearance(tempAppearance);
    dismissModal();
  }

  return (
    <>
      <Container
        header={
          <Header actions={<Button onClick={() => setModalVisible(true)}>Edit</Button>}>
            Appearance
          </Header>
        }
      >
        {appearanceLabels[appearance]}
      </Container>
      <Modal
        visible={modalVisible}
        header="Appearance"
        onDismiss={dismissModal}
        footer={
          <Box float="right">
            <SpaceBetween size="xs" direction="horizontal">
              <Button variant="link" onClick={dismissModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <FormField label="Appearance">
          <RadioGroup
            value={tempAppearance}
            items={items}
            onChange={(event) => setTempAppearance(event.detail.value as IAppearance)}
          />
        </FormField>
      </Modal>
    </>
  );
}
