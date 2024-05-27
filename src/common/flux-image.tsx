import React, { useEffect, useState } from 'react';
import { Badge } from '@cloudscape-design/components';
import Icon from '@cloudscape-design/components/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignalStream } from '@fortawesome/pro-solid-svg-icons';
import { spaceScaledL, spaceScaledXs } from '@cloudscape-design/design-tokens';

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
          style={{
            ...rest.style,
            opacity: isLoaded ? '1' : '0',
            transition: 'opacity 200ms ease-in-out',
          }}
        />
        {isLive && (
          <div style={{ position: 'absolute', bottom: spaceScaledXs, right: spaceScaledXs }}>
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
