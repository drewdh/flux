import clsx from 'clsx';
import { colorBackgroundInputDisabled } from '@cloudscape-design/design-tokens';

import styles from './styles.module.scss';
import { useGetUsers } from '../../api/api';

export default function Avatar({ userId, size = 'm', color }: Props) {
  const { data } = useGetUsers({ ids: [userId!] }, { enabled: !!userId });
  const userData = data?.data[0];

  return (
    <div
      role="img"
      aria-label={userData?.display_name}
      style={{
        backgroundImage: `url(${userData?.profile_image_url})`,
        backgroundColor: color ?? colorBackgroundInputDisabled,
      }}
      className={clsx(styles.avatar, styles[size])}
    >
      <div className={clsx(styles.spacer, styles[size])} />
    </div>
  );
}

interface Props {
  userId: string | undefined;
  color?: string;
  size?: AvatarProps.Size;
}
export declare namespace AvatarProps {
  type Size = 'xs' | 's' | 'm' | 'l';
}
