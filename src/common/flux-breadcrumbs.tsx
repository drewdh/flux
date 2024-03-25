import { useCallback, useMemo } from 'react';
import BreadcrumbGroup, {
  BreadcrumbGroupProps,
} from '@cloudscape-design/components/breadcrumb-group';

import useFollow from './use-follow';
import { Pathname } from 'utilities/routes';

export default function FluxBreadcrumbs({ items }: Props) {
  const follow = useFollow();
  const allItems = useMemo((): BreadcrumbGroupProps.Item[] => {
    return [{ text: 'Flux', href: Pathname.Home }, ...items];
  }, [items]);

  const handleFollow = useCallback(
    (event: CustomEvent<BreadcrumbGroupProps.ClickDetail>): void => {
      const { href, external: isExternal } = event.detail;
      follow({ href, isExternal, event });
    },
    [follow]
  );

  return <BreadcrumbGroup onFollow={handleFollow} items={allItems} />;
}

interface Props {
  items: BreadcrumbGroupProps.Item[];
}
