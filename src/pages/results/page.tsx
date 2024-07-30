import { useSearchParams } from 'react-router-dom';

import useTitle from 'utilities/use-title';
import FluxAppLayout from 'common/flux-app-layout';
import CategoryResults from './category-results';
import ChannelResults from './channel-results';
import useNavigableTabs from 'utilities/use-navigable-tabs';
import { Pathname } from 'utilities/routes';
import FluxTabs from 'common/flux-tabs';

enum TabId {
  Channels = 'channels',
  Categories = 'categories',
}

export default function Page() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') ?? '';
  useTitle(`${query} - Flux`);
  const { activeTabId, handleChange } = useNavigableTabs({
    searchParamKey: 'tabId',
    defaultTabId: TabId.Channels,
  });

  return (
    <FluxAppLayout
      toolsHide
      navigationHide
      content={
        <FluxTabs
          activeTabId={activeTabId}
          onChange={handleChange}
          tabs={[
            {
              href: `${Pathname.Results}?query=${query}&tabId=${TabId.Channels}`,
              id: TabId.Channels,
              label: 'Live channels',
              content: <ChannelResults query={query} />,
            },
            {
              href: `${Pathname.Results}?query=${query}&tabId=${TabId.Categories}`,
              id: TabId.Categories,
              label: 'Categories',
              content: <CategoryResults query={query} />,
            },
          ]}
        />
      }
    />
  );
}
