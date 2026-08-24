import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import FluxImage from 'common/flux-image';
import styles from './styles.module.scss';

/** Container with top media that doesn't restrict the media's height */
export default function CategoryThumbnail({ href, imgSrc, title }: Props) {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onPointerEnter={() => setIsFocused(true)}
      onPointerLeave={() => setIsFocused(false)}
      className={clsx(styles.container, isFocused && styles.focused)}
      onClick={() => navigate(href)}
    >
      {/* Leave alt empty since it's the same text as the category title */}
      <Link to={href} aria-hidden="true" tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        <FluxImage alt="" src={imgSrc} className={styles.media} />
      </Link>
      <div className={styles.titleWrapper}>
        <img src={imgSrc} alt="" aria-hidden="true" className={styles.imageBg} />
        <div className={styles.imageBlur} />
        <Link to={href} className={styles.title} title={title} onClick={(e) => e.stopPropagation()}>
          {title}
        </Link>
      </div>
    </div>
  );
}

interface Props {
  imgSrc: string;
  href: string;
  title: string;
}
