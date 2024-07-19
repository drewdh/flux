import { ReactNode } from 'react';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import FlexibleColumnLayout from 'common/flexible-column-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';

import styles from './styles.module.scss';

export default function FluxCards<T>({
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
}: FluxCardsProps<T>) {
  function renderContent() {
    if (invalid) {
      return error;
    }
    if (loading) {
      return (
        <div className={styles.emptyWrapper}>
          <StatusIndicator type="loading">{loadingText}</StatusIndicator>
        </div>
      );
    }
    if (empty && items.length === 0) {
      return <div className={styles.emptyWrapper}>{empty}</div>;
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
