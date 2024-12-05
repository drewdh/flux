import { useCallback, useEffect, useState } from 'react';

function getIsMobile() {
  if (window.matchMedia) {
    return window.matchMedia(`(max-width: 688px)`).matches;
  }

  return window.innerWidth <= 688;
}

export default function useMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(getIsMobile());

  const listener = useCallback((): void => {
    setIsMobile(getIsMobile());
  }, []);

  useEffect(() => {
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [listener]);

  return isMobile;
}
