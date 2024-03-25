import { useCallback, useEffect, useMemo, useState } from 'react';
import Modal from '@cloudscape-design/components/modal';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import FormField from '@cloudscape-design/components/form-field';
import RadioGroup, { RadioGroupProps } from '@cloudscape-design/components/radio-group';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';

import { Appearance, SettingsValues } from './types';
import { handleMatchChange, setDarkMode } from './utilities';
import useLocalStorage, { LocalStorageKey } from 'utilities/use-local-storage';
import { defaultSettings } from './constants';

let isInitialized = false;
type RadioChangeEvent = NonCancelableCustomEvent<RadioGroupProps.ChangeDetail>;

export default function Settings({ onDismiss, visible }: Props) {
  const [settings, setSettings] = useLocalStorage<SettingsValues>(
    LocalStorageKey.GlobalSettings,
    defaultSettings
  );
  const [match] = useState(window.matchMedia('(prefers-color-scheme: dark)'));

  const setAppearance = useCallback(
    (appearance: Appearance): void => {
      if (appearance === Appearance.Automatic) {
        match.addEventListener('change', handleMatchChange);
        setDarkMode(match.matches);
      } else {
        match.removeEventListener('change', handleMatchChange);
        setDarkMode(appearance === Appearance.Dark);
      }
    },
    [match]
  );

  useEffect(
    function initializeAppearance() {
      if (isInitialized) {
        return;
      }
      setAppearance(settings.appearance);
    },
    [setAppearance, settings]
  );

  const appearanceItems = useMemo((): RadioGroupProps.RadioButtonDefinition[] => {
    return [
      {
        label: 'System default',
        value: Appearance.Automatic,
      },
      {
        label: 'Dark',
        value: Appearance.Dark,
      },
      {
        label: 'Light',
        value: Appearance.Light,
      },
    ];
  }, []);

  // Clean up dark mode listener
  useEffect((): (() => void) => {
    return () => {
      match.removeEventListener('change', handleMatchChange);
    };
  }, [match]);

  const handleAppearanceChange = useCallback(
    (event: RadioChangeEvent): void => {
      const appearance = event.detail.value as Appearance;
      setSettings((prevState) => ({
        ...prevState,
        appearance,
      }));
      setAppearance(appearance);
    },
    [setAppearance, setSettings]
  );

  return (
    <Modal
      header="Settings"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="primary" onClick={onDismiss}>
              Done
            </Button>
          </SpaceBetween>
        </Box>
      }
      size="small"
      visible={visible}
      onDismiss={onDismiss}
    >
      <SpaceBetween size="l">
        <FormField label="Appearance">
          <RadioGroup
            onChange={handleAppearanceChange}
            value={settings.appearance}
            items={appearanceItems}
          />
        </FormField>
      </SpaceBetween>
    </Modal>
  );
}

interface Props {
  visible: boolean;
  onDismiss: () => void;
}
