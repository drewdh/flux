import { useSearchParams } from 'react-router-dom';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Header from '@cloudscape-design/components/header';
import Tabs from '@cloudscape-design/components/tabs';

import useTitle from 'utilities/use-title';
import FluxAppLayout from 'common/flux-app-layout';
import CategoryResults from './category-results';
import ChannelResults from './channel-results';

enum TabId {
  Channels = 'channels',
  Categories = 'categories',
}

export default function Page() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') ?? '';
  useTitle(`${query} - Flux`);

  return (
    <FluxAppLayout
      toolsHide
      navigationHide
      content={
        <SpaceBetween direction="vertical" size="m">
          <Header variant="h1">Results for "{query}"</Header>
          <Tabs
            tabs={[
              {
                id: TabId.Channels,
                label: 'Live channels',
                content: <ChannelResults query={query} />,
              },
              {
                id: TabId.Categories,
                label: 'Categories',
                content: <CategoryResults query={query} />,
              },
            ]}
          />
        </SpaceBetween>
      }
    />
  );
}
