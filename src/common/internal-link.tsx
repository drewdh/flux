import { PropsWithChildren, useCallback } from 'react';
import Link, { LinkProps } from '@cloudscape-design/components/link';
import useFollow from './use-follow';

export default function InternalLink({
  children,
  href,
  onFollow,
  ...rest
}: PropsWithChildren<Props>) {
  const follow = useFollow();

  const handleFollow = useCallback(
    (event: CustomEvent<LinkProps.FollowDetail>): void => {
      follow({ href, event });
      if (onFollow) {
        onFollow(event);
      }
    },
    [follow, href, onFollow]
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
