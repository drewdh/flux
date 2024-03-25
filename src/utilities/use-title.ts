import { useEffect } from 'react';

const defaultTitle = 'Flux';

/** Updates document title */
export default function useTitle(title?: string, { isNested }: UseTitleOptions = {}) {
  useEffect(
    function updateTitle() {
      // TODO: A parent component can overwrite this. Fix this.
      const titleParts = isNested ? document.title.split(' - ') : [];
      if (title) {
        titleParts.splice(0, 0, title);
      }
      titleParts.push(defaultTitle);
      document.title = titleParts.join(' - ');
    },
    [title, isNested]
  );
}

interface UseTitleOptions {
  /** @deprecated This is broken */
  isNested?: boolean;
}
