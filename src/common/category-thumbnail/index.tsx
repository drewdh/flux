import { Link } from 'react-router-dom';

import FluxImage from 'common/flux-image';
import styles from './styles.module.scss';

/** Container with top media that doesn't restrict the media's height */
export default function CategoryThumbnail({ href, imgSrc, title }: Props) {
  return (
    <Link to={href}>
      <div className={styles.container}>
        <div className={styles.mediaWrapper}>
          <FluxImage alt={title} src={imgSrc} className={styles.media} />
        </div>
        <div className={styles.titleWrapper}>
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
