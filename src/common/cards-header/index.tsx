import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import { PropsWithChildren } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';

export default function CardsHeader({ children, sticky = false }: PropsWithChildren<Props>) {
  return (
    <div className={clsx(sticky && styles.sticky)}>
      <Container disableContentPaddings>
        <Box padding={{ vertical: 's', horizontal: 'l' }}>{children}</Box>
      </Container>
    </div>
  );
}

interface Props {
  sticky?: boolean;
}
