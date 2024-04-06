import clsx from 'clsx';
import { colorBackgroundInputDisabled } from '@cloudscape-design/design-tokens';

import styles from './styles.module.scss';
import { useGetUsers } from '../../api/api';

export default function Avatar({ userId, size = 'm', color }: Props) {
  const { data } = useGetUsers({ ids: [userId] });
  const userData = data?.data[0];

  return (
    <div
      role="img"
      aria-label={userData?.display_name}
      style={{
        backgroundImage: `url(${userData?.profile_image_url.replace('300x300', '70x70')})`,
        backgroundColor: color ?? colorBackgroundInputDisabled,
      }}
      className={clsx(styles.avatar, styles[size])}
    >
      <div className={clsx(styles.spacer, styles[size])} />
    </div>
  );
}

interface Props {
  color?: string;
  userId: string;
  size?: 'xs' | 's' | 'm';
}
