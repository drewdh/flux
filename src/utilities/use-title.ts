import { useEffect } from 'react';

/** Updates document title */
export default function useTitle(title: string) {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = 'Flux';
    };
  }, [title]);
}
