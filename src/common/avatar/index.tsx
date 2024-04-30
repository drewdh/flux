import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import styles from './styles.module.scss';
import { useGetUsers } from '../../api/api';

export default function Avatar({ userId, size = 'm', color }: Props) {
  const imgRef = useRef<HTMLImageElement>(new Image());
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { data } = useGetUsers({ ids: [userId!] }, { enabled: !!userId });
  const userData = data?.data[0];

  useEffect(() => {
    if (!imgRef.current || !userData?.profile_image_url) {
      return;
    }
    imgRef.current.className = clsx(styles.avatar, styles[size]);
    imgRef.current.alt = userData.display_name;
    imgRef.current.onload = () => setIsLoaded(true);
    imgRef.current.src = userData?.profile_image_url;
  }, [size, userData]);

  if (!isLoaded) {
    return <div className={clsx(styles.avatar, styles[size])} />;
  }

  return (
    <div
      style={{ display: 'inline' }}
      dangerouslySetInnerHTML={{ __html: imgRef.current.outerHTML }}
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
