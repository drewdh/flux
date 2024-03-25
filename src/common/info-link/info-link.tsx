import Link from '@cloudscape-design/components/link';
import { ReactNode, useCallback } from 'react';

import { useHelpPanel } from '../../help-panel/help-panel';

export default function InfoLink({ content }: Props) {
  const { openPanel, setContent } = useHelpPanel();

  const handleFollow = useCallback((): void => {
    setContent(content);
    openPanel();
  }, [content, setContent, openPanel]);

  return (
    <Link onFollow={handleFollow} variant="info">
      Info
    </Link>
  );
}

interface Props {
  content: ReactNode;
}
