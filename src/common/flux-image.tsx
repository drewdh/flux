import React, { useEffect, useState } from 'react';

function preloadImage(src: string) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = resolve;
    image.onerror = reject;
  });
}

export default function FluxImage({
  src,
  ...rest
}: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
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
      <img
        src={src}
        {...rest}
        style={{ ...rest.style, visibility: isLoaded ? 'visible' : 'hidden' }}
      />
    </div>
  );
}
