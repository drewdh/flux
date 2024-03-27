import Alert from '@cloudscape-design/components/alert';

import FluxAppLayout from 'common/flux-app-layout';
import useTitle from 'utilities/use-title';

export default function NotFoundPage() {
  useTitle('Page not found - Flux');

  return (
    <FluxAppLayout
      maxContentWidth={350}
      toolsHide
      navigationHide
      content={<Alert>The page you are looking for does not exist.</Alert>}
    />
  );
}
