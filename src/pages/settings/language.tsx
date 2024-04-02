import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Select from '@cloudscape-design/components/select';

import styles from './styles.module.scss';

export default function Language() {
  return (
    <Container header={<Header>Language</Header>}>
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
