import { useState } from 'react';
import clsx from 'clsx';
import Link from '@cloudscape-design/components/link';

import styles from './styles.module.scss';
import { footerId } from './constants';
import Feedback from '../feedback/feedback';

export default function Footer() {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState<boolean>(false);

  return (
    <>
      <div className={clsx(styles.container, 'awsui-context-top-navigation')} id={footerId}>
        <div>
          <Link variant="secondary" color="inverted" onFollow={() => setIsFeedbackVisible(true)}>
            Send feedback
          </Link>
        </div>
      </div>
      <Feedback visible={isFeedbackVisible} onDismiss={() => setIsFeedbackVisible(false)} />
    </>
  );
}
