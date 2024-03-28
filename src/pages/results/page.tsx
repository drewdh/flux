import { useSearchParams } from 'react-router-dom';
import SpaceBetween from '@cloudscape-design/components/space-between';

import useTitle from 'utilities/use-title';
import { useSearchChannels } from '../../api/api';
import FluxAppLayout from 'common/flux-app-layout';
import Result from './result';

export default function Page() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') ?? '';
  useTitle(`${query} - Flux`);

  const { data, isLoading } = useSearchChannels({ query });
  const allResults = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <FluxAppLayout
      toolsHide
      navigationHide
      content={
        <SpaceBetween size="l">
          {allResults.map((result) => {
            console.log(result);
            return <Result channel={result} />;
          })}
        </SpaceBetween>
      }
    />
  );
}
