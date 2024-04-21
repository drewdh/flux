import { useEffect, useState } from 'react';

export default function useElementHeight(selector: string): number {
  const element = document.querySelector(selector);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (!element) {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      setHeight(entries[0].borderBoxSize[0].blockSize);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [element]);

  return height;
}
