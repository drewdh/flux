import Button, { ButtonProps } from '@cloudscape-design/components/button';
import { PropsWithChildren, useCallback } from 'react';

import useFollow from './use-follow';

export default function ButtonLink({ children, href, ...props }: PropsWithChildren<Props>) {
  const follow = useFollow();

  const handleFollow = useCallback(
    (event: CustomEvent<ButtonProps.FollowDetail>): void => {
      follow({ href, isExternal: false, event });
    },
    [follow, href]
  );

  return (
    <Button {...props} href={href} onFollow={handleFollow}>
      {children}
    </Button>
  );
}

interface Props extends ButtonProps {
  href: string;
}
