import { NavigateOptions, To, useLocation, useNavigate } from 'react-router';
import { useCallback } from 'react';

type NavigateFunction = (to: To, options?: NavigateOptions) => void;

export default function useNavigateWithRef(): NavigateFunction {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return useCallback(
    (to: To, options: NavigateOptions | undefined): void => {
      navigate(to, {
        ...options,
        state: {
          ...options?.state,
          ref: pathname,
        },
      });
    },
    [navigate, pathname]
  );
}
