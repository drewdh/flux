import { useSearchParams } from 'react-router-dom';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Alert from '@cloudscape-design/components/alert';

import useTitle from 'utilities/use-title';
import { useSearchCategories, useSearchChannels } from '../../api/api';
import FluxAppLayout from 'common/flux-app-layout';
import Result from './result';
import FullHeightContent from 'common/full-height-content';
import Empty from 'common/empty/empty';
import Box from '@cloudscape-design/components/box';
import ButtonLink from 'common/button-link';
import { interpolatePathname, Pathname } from 'utilities/routes';

export default function Page() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') ?? '';
  useTitle(`${query} - Flux`);

  const {
    data: channelData,
    isLoading: isLoadingChannels,
    error: channelsError,
  } = useSearchChannels({ query });
  const {
    data: categoryData,
    isLoading: isLoadingCategories,
    error: categoryError,
  } = useSearchCategories({
    query,
    pageSize: 10,
  });
  const allChannelResults = channelData?.pages.flatMap((page) => page.data) ?? [];
  const allCategoryResults = categoryData?.pages.flatMap((page) => page.data) ?? [];
  const isLoading = isLoadingChannels || isLoadingCategories;
  const error = channelsError || categoryError;
  const isEmpty = !allChannelResults.length || !allCategoryResults.length;

  function renderContent() {
    if (isLoading) {
      return (
        <FullHeightContent>
          <StatusIndicator type="loading">Loading results</StatusIndicator>
        </FullHeightContent>
      );
    }
    if (error) {
      return (
        <FullHeightContent>
          <Alert header={error.name} type="error">
            {error.message}
          </Alert>
        </FullHeightContent>
      );
    }
    if (isEmpty) {
      return (
        <FullHeightContent>
          <Empty header="No results" message="No live channels matched your search." />
        </FullHeightContent>
      );
    }
    return (
      <SpaceBetween size="l">
        {!!allCategoryResults.length && (
          <div>
            <Box variant="h2">Categories</Box>
            <SpaceBetween size="xs" direction="horizontal">
              {allCategoryResults.map((result) => (
                <ButtonLink href={interpolatePathname(Pathname.Game, { gameId: result.id })}>
                  {result.name}
                </ButtonLink>
              ))}
            </SpaceBetween>
          </div>
        )}
        {!!allChannelResults.length && (
          <div>
            <Box variant="h2">Live channels</Box>
            <SpaceBetween size="l">
              {allChannelResults.map((result) => (
                <Result channel={result} />
              ))}
            </SpaceBetween>
          </div>
        )}
      </SpaceBetween>
    );
  }

  return <FluxAppLayout toolsHide navigationHide content={renderContent()} />;
}
