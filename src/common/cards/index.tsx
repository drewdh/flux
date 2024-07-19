import { ReactNode } from 'react';
import Box from '@cloudscape-design/components/box';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import FlexibleColumnLayout from 'common/flexible-column-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';

import styles from './styles.module.scss';

export default function FluxCards({
  columns,
  empty,
  error,
  invalid,
  itemMapper,
  items,
  loading,
  loadingText,
  minColumnWidth,
  pagination,
}: FluxCardsProps) {
  function renderContent() {
    if (invalid) {
      return error;
    }
    if (loading) {
      return (
        <Box textAlign="center">
          <StatusIndicator type="loading">{loadingText}</StatusIndicator>
        </Box>
      );
    }
    if (empty && items.length === 0) {
      return <Box textAlign="center">{empty}</Box>;
    }

    return (
      <FlexibleColumnLayout columns={columns} minColumnWidth={minColumnWidth}>
        {items.map(itemMapper)}
      </FlexibleColumnLayout>
    );
  }

  return (
    <SpaceBetween direction="vertical" size="l">
      {renderContent()}
      {pagination ? <div className={styles.paginationWrapper}>{pagination}</div> : null}
    </SpaceBetween>
  );
}

export interface FluxCardsProps<T = any> {
  columns?: number;
  empty?: ReactNode;
  /** Set this to `true` to render the content in the `error` prop. */
  invalid?: boolean;
  itemMapper: (item: T) => ReactNode;
  items: ReadonlyArray<T>;
  loading?: boolean;
  loadingText?: string;
  error?: ReactNode;
  minColumnWidth?: number;
  pagination?: ReactNode;
}
