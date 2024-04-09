import Box from '@cloudscape-design/components/box';
import { ReactNode } from 'react';

import styles from './styles.module.scss';
import SpaceBetween from '@cloudscape-design/components/space-between';

export default function Empty({ header, message, action }: Props) {
  return (
    <div className={styles.wrapper}>
      <SpaceBetween size="xxs">
        <div>
          <b>{header}</b>
          {message && (
            <Box variant="p" color="inherit">
              {message}
            </Box>
          )}
        </div>
        {action}
      </SpaceBetween>
    </div>
  );
}

interface Props {
  header: string;
  message?: string;
  action?: ReactNode;
}
