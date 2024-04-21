import { useSearchParams } from 'react-router-dom';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Alert from '@cloudscape-design/components/alert';

import useTitle from 'utilities/use-title';
import { useSearchChannels } from '../../api/api';
import FluxAppLayout from 'common/flux-app-layout';
import Result from './result';
import FullHeightContent from 'common/full-height-content';
import Empty from 'common/empty/empty';

export default function Page() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') ?? '';
  useTitle(`${query} - Flux`);

  const { data, isLoading, error } = useSearchChannels({ query });
  const allResults = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <FluxAppLayout
      toolsHide
      navigationHide
      content={
        isLoading ? (
          <FullHeightContent>
            <StatusIndicator type="loading">Loading results</StatusIndicator>
          </FullHeightContent>
        ) : error ? (
          <FullHeightContent>
            <Alert header={error.name} type="error">
              {error.message}
            </Alert>
          </FullHeightContent>
        ) : !allResults.length ? (
          <FullHeightContent>
            <Empty header="No results" message="No live channels matched your search." />
          </FullHeightContent>
        ) : (
          <SpaceBetween size="l">
            {allResults.map((result) => (
              <Result channel={result} />
            ))}
          </SpaceBetween>
        )
      }
    />
  );
}
