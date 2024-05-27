import clsx from 'clsx';

import styles from './styles.module.scss';
import { useGetUsers } from '../../api/api';
import FluxImage from 'common/flux-image';

export default function Avatar({ userId, size = 'm', color }: Props) {
  const { data } = useGetUsers({ ids: [userId!] }, { enabled: !!userId });
  const userData = data?.data[0];

  return (
    <FluxImage
      alt={userData?.display_name}
      className={clsx(styles.avatar, styles[size])}
      src={userData?.profile_image_url}
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
