import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInWeeks,
  differenceInYears,
} from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export default function useGetRelativeTime(): (unparsedDate?: number | string | Date) => string {
  const { t } = useTranslation();

  return useCallback(
    (unparsedDate?: number | string | Date) => {
      if (!unparsedDate) {
        return '';
      }
      const today = new Date();
      const date = new Date(unparsedDate);
      const diffInSeconds = differenceInSeconds(today, date);
      if (diffInSeconds < 60) {
        return t('time.now');
      }
      const diffInMinutes = differenceInMinutes(today, date);
      if (diffInMinutes < 60) {
        return t('time.minutes', { count: diffInMinutes });
      }
      const diffInHours = differenceInHours(today, date);
      if (diffInHours < 25) {
        return t('time.hours', { count: diffInHours });
      }
      const diffInDays = differenceInDays(today, date);
      if (diffInDays < 32) {
        return t('time.days', { count: diffInDays });
      }
      const diffInWeeks = differenceInWeeks(today, date);
      if (diffInWeeks < 5) {
        return t('time.weeks', { count: diffInWeeks });
      }
      const diffInMonths = differenceInMonths(today, date);
      if (diffInMonths < 13) {
        return t('time.months', { count: diffInMonths });
      }
      const diffInYears = differenceInYears(today, date);
      return t('time.years', { count: diffInYears });
    },
    [t]
  );
}
