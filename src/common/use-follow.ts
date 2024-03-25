import { useLocation } from 'react-router';
import { useCallback } from 'react';
import useNavigateWithRef from './use-navigate-with-ref';

export default function useFollow(): State {
  const navigate = useNavigateWithRef();
  const { pathname } = useLocation();

  return useCallback(
    (options: Options): void => {
      const { isExternal, event, href } = options;
      if (isExternal) {
        return;
      }
      event.preventDefault();
      navigate(href, {
        state: {
          ref: pathname,
        },
      });
    },
    [pathname, navigate]
  );
}

interface Options {
  href: string;
  isExternal?: boolean;
  event: CustomEvent;
}

type State = (opts: Options) => void;
