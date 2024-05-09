import clsx from 'clsx';
import Link from '@cloudscape-design/components/link';

import styles from './styles.module.scss';
import { footerId } from './constants';
import { useFeedback } from '../feedback/feedback-context';

export default function Footer() {
  const { setIsFeedbackVisible } = useFeedback();

  return (
    <>
      <div className={clsx(styles.container, 'awsui-context-top-navigation')} id={footerId}>
        <div>
          <Link variant="secondary" color="inverted" onFollow={() => setIsFeedbackVisible(true)}>
            Send feedback
          </Link>
        </div>
      </div>
    </>
  );
}
