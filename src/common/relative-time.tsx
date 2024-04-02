import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInWeeks,
  differenceInYears,
  format,
} from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function RelativeTime({ date: unparsedDate, inline }: Props) {
  const [relativeTime, setRelativeTime] = useState<string>('');
  const { t } = useTranslation();

  const updateRelativeTime = useCallback((): void => {
    if (!unparsedDate) {
      return setRelativeTime('');
    }
    const today = new Date();
    const date = new Date(unparsedDate);
    const diffInSeconds = differenceInSeconds(today, date);
    if (diffInSeconds < 60) {
      return setRelativeTime(t('time.now'));
    }
    const diffInMinutes = differenceInMinutes(today, date);
    if (diffInMinutes < 60) {
      return setRelativeTime(t('time.minutes', { count: diffInMinutes }));
    }
    const diffInHours = differenceInHours(today, date);
    if (diffInHours < 25) {
      return setRelativeTime(t('time.hours', { count: diffInHours }));
    }
    const diffInDays = differenceInDays(today, date);
    if (diffInDays < 32) {
      return setRelativeTime(t('time.days', { count: diffInDays }));
    }
    const diffInWeeks = differenceInWeeks(today, date);
    if (diffInWeeks < 5) {
      return setRelativeTime(t('time.weeks', { count: diffInWeeks }));
    }
    const diffInMonths = differenceInMonths(today, date);
    if (diffInMonths < 13) {
      return setRelativeTime(t('time.months', { count: diffInMonths }));
    }
    const diffInYears = differenceInYears(today, date);
    setRelativeTime(t('time.years', { count: diffInYears }));
  }, [t, unparsedDate]);

  const absoluteTimestamp = useMemo((): string => {
    if (!unparsedDate) {
      return '';
    }
    return format(unparsedDate, "MMMM d, yyyy, HH:mm '(UTC'XXXXX')'");
  }, [unparsedDate]);

  useEffect(() => {
    updateRelativeTime();
    const intervalId: number = window.setInterval(updateRelativeTime, 60 * 1000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [updateRelativeTime]);

  const formattedRelativeTime = inline ? relativeTime.toLowerCase() : relativeTime;

  return <span title={absoluteTimestamp}>{formattedRelativeTime}</span>;
}

interface Props {
  date?: number | string | Date;
  inline?: boolean;
}
