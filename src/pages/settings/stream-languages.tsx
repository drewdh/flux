import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import { useMemo } from 'react';
import Multiselect, { MultiselectProps } from '@cloudscape-design/components/multiselect';

import { useSettings } from 'utilities/settings';

const languageOptions: MultiselectProps.Option[] = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'Italiano', value: 'it' },
  { label: 'Bahasa Indonesia', value: 'id' },
  { label: 'Català', value: 'ca' },
  { label: 'Dansk', value: 'da' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Français', value: 'fr' },
  { label: 'Magyar', value: 'hu' },
  { label: 'Nederlands', value: 'nl' },
  { label: 'Norsk', value: 'no' },
  { label: 'Polski', value: 'pl' },
  { label: 'Português', value: 'pt' },
  { label: 'Română', value: 'ro' },
  { label: 'Slovenčina', value: 'sk' },
  { label: 'Suomi', value: 'fi' },
  { label: 'Svenska', value: 'sv' },
  { label: 'Tagalog', value: 'tl' },
  { label: 'Tiếng Việt', value: 'vi' },
  { label: 'Türkçe', value: 'tr' },
  { label: 'Čeština', value: 'cs' },
  { label: 'Ελληνικά', value: 'el' },
  { label: 'Български', value: 'bg' },
  { label: 'Русский', value: 'ru' },
  { label: 'Українська', value: 'uk' },
  { label: 'العربية', value: 'ar' },
  { label: 'بهاس ملايو', value: 'ms' },
  { label: 'मानक हिन्दी', value: 'hi' },
  { label: 'ภาษาไทย', value: 'th' },
  { label: '中文', value: 'zh' },
  { label: '日本語', value: 'ja' },
  { label: '한국어', value: 'ko' },
  { label: 'American Sign Language', value: 'ase' },
];

export default function StreamLanguages() {
  const { streamLanguages, setStreamLanguages } = useSettings();

  const selectedOptions = useMemo((): MultiselectProps.Options => {
    return streamLanguages.map((lang) => {
      const match = languageOptions.find((option) => option.value === lang);
      return match || { label: lang, value: lang };
    });
  }, [streamLanguages]);

  return (
    <>
      <Container
        header={
          <Header description="Streams in your preferred languages will be shown more frequently.">
            Preferred stream languages
          </Header>
        }
      >
        {/* TODO: Consider adding ordering for weighting */}
        <Multiselect
          ariaLabel="Preferred stream languages"
          filteringType="auto"
          placeholder="Choose languages"
          selectedOptions={selectedOptions}
          options={languageOptions}
          onChange={(e) => setStreamLanguages(e.detail.selectedOptions.map((opt) => opt.value!))}
        />
      </Container>
    </>
  );
}
