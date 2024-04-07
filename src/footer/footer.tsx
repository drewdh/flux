import clsx from 'clsx';
import Link from '@cloudscape-design/components/link';

import styles from './styles.module.scss';
import { footerId } from './constants';
import useFeedback from '../feedback/use-feedback';

export default function Footer() {
  const { openFeedback } = useFeedback();

  return (
    <>
      <div className={clsx(styles.container, 'awsui-context-top-navigation')} id={footerId}>
        <div>
          <Link variant="secondary" color="inverted" onFollow={() => openFeedback()}>
            Send feedback
          </Link>
        </div>
      </div>
    </>
  );
}
