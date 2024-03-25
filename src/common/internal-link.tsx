import { PropsWithChildren, useCallback } from 'react';
import Link, { LinkProps } from '@cloudscape-design/components/link';
import useFollow from './use-follow';

export default function InternalLink({ children, href, ...rest }: PropsWithChildren<Props>) {
  const follow = useFollow();

  const handleFollow = useCallback(
    (event: CustomEvent<LinkProps.FollowDetail>): void => {
      follow({ href, event });
    },
    [follow, href]
  );

  return (
    <Link {...rest} onFollow={handleFollow} href={href}>
      {children}
    </Link>
  );
}

interface Props extends LinkProps {
  href: string;
}
