import clsx from 'clsx';
import { colorBackgroundInputDisabled } from '@cloudscape-design/design-tokens';

import styles from './styles.module.scss';
import { useGetUsers } from './api';

export default function Avatar({ userId, size, color }: Props) {
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
      className={clsx(styles.avatar, size === 'small' && styles.small)}
    >
      <div className={clsx(styles.spacer, size === 'small' && styles.small)} />
    </div>
  );
}

interface Props {
  color?: string;
  userId: string;
  size?: 'normal' | 'small';
}
