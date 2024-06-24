import { PropsWithChildren } from 'react';

import styles from './styles.module.scss';
import Box from '@cloudscape-design/components/box';

export default function DrawerFooter({ children, header }: PropsWithChildren<Props>) {
  return (
    <div className={styles.footer}>
      <Box variant="h3" padding={{ bottom: 'xs', top: 'n' }}>
        {header}
      </Box>
      {children}
    </div>
  );
}

interface Props {
  header: string;
}
