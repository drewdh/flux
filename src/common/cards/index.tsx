import { ReactNode, useEffect, useLayoutEffect, useRef } from 'react';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import FlexibleColumnLayout from 'common/flexible-column-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { Spinner } from '@cloudscape-design/components';

export default function FluxCards<T>({
  columns,
  empty,
  error,
  fetchingNextPage,
  invalid,
  itemMapper,
  items,
  loading,
  loadingText,
  minColumnWidth,
  onLastItemVisible,
}: FluxCardsProps<T>) {
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLastItemVisible?.();
        }
      },
      { threshold: 1 }
    );
  }, [onLastItemVisible]);

  useLayoutEffect(() => {
    if (items.length) {
      const lastItem = document.querySelector('.flux-card-last-item');
      observerRef.current?.observe(lastItem!);
    }
  }, [items]);

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
        {items.map(itemMapper).map((item, index) => (
          <span className={clsx(index === items.length - 1 && 'flux-card-last-item')}>{item}</span>
        ))}
      </FlexibleColumnLayout>
    );
  }

  return (
    <SpaceBetween direction="vertical" size="l">
      {renderContent()}
      {fetchingNextPage && (
        <div className={styles.spinnerWrapper}>
          <Spinner size="big" />
        </div>
      )}
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
  fetchingNextPage?: boolean;
  loading?: boolean;
  loadingText?: string;
  onLastItemVisible?: () => void;
  error?: ReactNode;
  minColumnWidth?: number;
}
