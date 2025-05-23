import { Link } from 'react-router-dom';

import FluxImage from 'common/flux-image';
import styles from './styles.module.scss';

/** Container with top media that doesn't restrict the media's height */
export default function CategoryThumbnail({ href, imgSrc, title }: Props) {
  return (
    <Link to={href} className={styles.link}>
      <div className={styles.container}>
        {/* Leave alt empty since it's the same text as the category title */}
        <FluxImage alt="" src={imgSrc} className={styles.media} />
        <div className={styles.titleWrapper}>
          <img src={imgSrc} alt="" aria-hidden="true" className={styles.imageBg} />
          <div className={styles.imageBlur} />
          <div className={styles.title}>{title}</div>
        </div>
      </div>
    </Link>
  );
}

interface Props {
  imgSrc: string;
  href: string;
  title: string;
}
