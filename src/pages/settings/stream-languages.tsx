import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import { useState } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import FormField from '@cloudscape-design/components/form-field';
import Multiselect, { MultiselectProps } from '@cloudscape-design/components/multiselect';
import Tiles from '@cloudscape-design/components/tiles';
import Modal from '@cloudscape-design/components/modal';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';

import { useSettings } from 'utilities/settings';

enum TileOption {
  All = 'all',
  Custom = 'custom',
}

const languageOptions: MultiselectProps.Option[] = [
  { label: 'English', value: 'en' },
  { label: 'Deutsch', value: 'de' },
];

const langMap: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
};

export default function StreamLanguages() {
  const { streamLanguages, setStreamLanguages } = useSettings();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tileValue, setTileValue] = useState<TileOption>(TileOption.All);
  const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<MultiselectProps.Option>>(
    []
  );

  function edit() {
    setSelectedOptions(languageOptions.filter((option) => streamLanguages.includes(option.value!)));
    setTileValue(streamLanguages.length ? TileOption.Custom : TileOption.All);
    setModalVisible(true);
  }

  function cancel() {
    setModalVisible(false);
  }

  function save() {
    setModalVisible(false);
    if (tileValue === TileOption.All) {
      setStreamLanguages([]);
    } else {
      setStreamLanguages(selectedOptions.map((option) => option.value!));
    }
  }

  return (
    <>
      <Container
        header={<Header actions={<Button onClick={edit}>Edit</Button>}>Stream languages</Header>}
      >
        {streamLanguages.map((code) => langMap[code]).join(', ') || 'All languages'}
      </Container>
      <Modal
        header="Stream languages"
        onDismiss={cancel}
        visible={modalVisible}
        footer={
          <Box float="right">
            <SpaceBetween size="xs" direction="horizontal">
              <Button variant="link" onClick={cancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={save}>
                Save
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween size="l">
          <Tiles
            value={tileValue}
            items={[
              { label: 'Any', value: TileOption.All, description: 'Show streams in any language.' },
              {
                label: 'Custom',
                value: TileOption.Custom,
                description:
                  'Only show streams in the selected languages. This does not affect followed streams.',
              },
            ]}
            onChange={(e) => setTileValue(e.detail.value as TileOption)}
          />
          {tileValue === TileOption.Custom && (
            <FormField label="Languages">
              <Multiselect
                placeholder="Choose languages"
                selectedOptions={selectedOptions}
                options={languageOptions}
                onChange={(e) => setSelectedOptions(e.detail.selectedOptions)}
              />
            </FormField>
          )}
        </SpaceBetween>
      </Modal>
    </>
  );
}
