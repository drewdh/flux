import Box from '@cloudscape-design/components/box';

import InternalLink from 'common/internal-link';
import FluxImage from 'common/flux-image';
import styles from './styles.module.scss';

/** Container with top media that doesn't restrict the media's height */
export default function CategoryThumbnail({ href, imgSrc, title }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.mediaWrapper}>
        <InternalLink href={href}>
          <FluxImage alt={title} src={imgSrc} className={styles.media} />
        </InternalLink>
      </div>
      <Box padding="l" variant="h3">
        <InternalLink fontSize="heading-xs" href={href}>
          {title}
        </InternalLink>
      </Box>
    </div>
  );
}

interface Props {
  imgSrc: string;
  href: string;
  title: string;
}
