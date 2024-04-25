import { ReactNode } from 'react';
import { InternalColumnLayoutProps } from '@cloudscape-design/components/column-layout/interfaces';
import flattenChildren from 'react-keyed-flatten-children';
import clsx from 'clsx';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import styles from './styles.module.scss';

/*
  Edited version of Cloudscape component to allow for odd number of columns.
  https://github.com/cloudscape-design/components/blame/main/src/column-layout/flexible-column-layout/index.tsx
 */

function calculateCssColumnCount(
  columns: number,
  minColumnWidth: number,
  containerWidth: number | null
): number {
  if (!containerWidth) {
    return columns;
  }

  // First, calculate how many columns we can have based on the current container width and minColumnWidth.
  const targetColumnCount = Math.min(columns, Math.floor(containerWidth / minColumnWidth));

  // When we start wrapping into fewer columns than desired, we want to keep the number of columns even.
  return Math.max(1, targetColumnCount);
}

interface FlexibleColumnLayoutProps
  extends Pick<
    InternalColumnLayoutProps,
    'minColumnWidth' | 'columns' | 'variant' | 'borders' | 'disableGutters'
  > {
  children: ReactNode;
}

export default function FlexibleColumnLayout({
  columns = 1,
  minColumnWidth = 0,
  disableGutters,
  variant,
  children,
}: FlexibleColumnLayoutProps) {
  const [containerWidth, containerRef] = useContainerQuery((rect) => rect.contentBoxWidth);

  const columnCount = calculateCssColumnCount(columns, minColumnWidth, containerWidth);
  const shouldDisableGutters = variant !== 'text-grid' && disableGutters;

  // Flattening the children allows us to "see through" React Fragments and nested arrays.
  const flattenedChildren = flattenChildren(children);

  return (
    <div
      ref={containerRef}
      className={clsx(
        styles['css-grid'],
        styles[`grid-variant-${variant}`],
        shouldDisableGutters && [styles['grid-no-gutters']]
      )}
      style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
    >
      {flattenedChildren.map((child, i) => {
        // If this react child is a primitive value, the key will be undefined
        const key = (child as Record<'key', unknown>).key;

        return (
          <div
            key={key ? String(key) : undefined}
            className={clsx(styles.item, {
              [styles['first-column']]: i % columnCount === 0,
            })}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
