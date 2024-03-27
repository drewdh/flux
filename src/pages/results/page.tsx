import { useLocation } from 'react-router';
import useTitle from 'utilities/use-title';
import { useSearchChannels } from '../../api/api';
import SpaceBetween from '@cloudscape-design/components/space-between';
import FluxAppLayout from 'common/flux-app-layout';
import Result from './result';

export default function Page() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const query = params.get('query') ?? '';
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
