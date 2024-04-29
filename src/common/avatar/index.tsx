import clsx from 'clsx';
import { colorBackgroundInputDisabled } from '@cloudscape-design/design-tokens';

import styles from './styles.module.scss';
import { useGetUsers } from '../../api/api';

export default function Avatar({ userId, size = 'm', color }: Props) {
  const { data } = useGetUsers({ ids: [userId!] }, { enabled: !!userId });
  const userData = data?.data[0];

  return (
    <img
      alt={userData?.display_name}
      src={userData?.profile_image_url}
      className={clsx(styles.avatar, styles[size])}
    />
  );
}

interface Props {
  userId: string | undefined;
  color?: string;
  size?: AvatarProps.Size;
}
export declare namespace AvatarProps {
  type Size = 'xxs' | 'xs' | 's' | 'm' | 'l';
}
