import { useMemo } from 'react';

export default function useCounter({ count, selectedCount, isLoading, isOpenEnd }: Props): string {
  return useMemo((): string => {
    if (isLoading) {
      return '';
    }
    const countLabel = count.toLocaleString();
    const selectedLabel = selectedCount ? `${selectedCount.toLocaleString()}/` : '';
    return `(${selectedLabel}${countLabel}${isOpenEnd ? '+' : ''})`;
  }, [count, selectedCount, isOpenEnd, isLoading]);
}

interface Props {
  count: number;
  selectedCount?: number;
  isLoading?: boolean;
  isOpenEnd?: boolean;
}
