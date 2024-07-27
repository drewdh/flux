import Box from '@cloudscape-design/components/box';

import InternalLink from 'common/internal-link';
import FluxImage from 'common/flux-image';
import styles from './styles.module.scss';

/** Container with top media that doesn't restrict the media's height */
export default function CategoryThumbnail({ href, imgSrc, title }: Props) {
  return (
    <InternalLink href={href}>
      <div className={styles.container}>
        <div className={styles.mediaWrapper}>
          <FluxImage alt={title} src={imgSrc} className={styles.media} />
        </div>
        <Box padding={{ vertical: 's' }} variant="h5" color="inherit">
          {title}
        </Box>
      </div>
    </InternalLink>
  );
}

interface Props {
  imgSrc: string;
  href: string;
  title: string;
}
