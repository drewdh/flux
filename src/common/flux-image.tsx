import React, { useEffect, useState } from 'react';
import Badge from '@cloudscape-design/components/badge';
import Icon from '@cloudscape-design/components/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignalStream } from '@fortawesome/pro-solid-svg-icons';
import { spaceScaledXs } from '@cloudscape-design/design-tokens';

function preloadImage(src: string) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = resolve;
    image.onerror = reject;
  });
}

export default function FluxImage({ src, isLive, ...rest }: Props) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!src) {
      return;
    }
    preloadImage(src).finally(() => {
      setIsLoaded(true);
    });
  }, [src]);

  return (
    <div style={rest.style} className={rest.className}>
      <div style={{ position: 'relative' }}>
        <img
          src={src}
          {...rest}
          alt={rest.alt}
          style={{
            ...rest.style,
            opacity: isLoaded ? '1' : '0',
          }}
        />
        {isLive && (
          <div
            style={{
              position: 'absolute',
              bottom: spaceScaledXs,
              right: spaceScaledXs,
              pointerEvents: 'none',
            }}
          >
            <Badge color="red">
              <Icon svg={<FontAwesomeIcon icon={faSignalStream} />} /> LIVE
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}

interface Props
  extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  isLive?: boolean;
}
