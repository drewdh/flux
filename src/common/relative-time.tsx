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

import getCountString from 'utilities/get-count-string';

export default function RelativeTime({ date: unparsedDate, inline }: Props) {
  const [relativeTime, setRelativeTime] = useState<string>('');

  const updateRelativeTime = useCallback((): void => {
    if (!unparsedDate) {
      return setRelativeTime('');
    }
    const today = new Date();
    const date = new Date(unparsedDate);
    const diffInSeconds = differenceInSeconds(today, date);
    if (diffInSeconds < 60) {
      return setRelativeTime('Just now');
    }
    const diffInMinutes = differenceInMinutes(today, date);
    if (diffInMinutes < 60) {
      return setRelativeTime(
        getCountString({
          count: diffInMinutes,
          singularString: '{{count}} minute ago',
          otherString: '{{count}} minutes ago',
        })
      );
    }
    const diffInHours = differenceInHours(today, date);
    if (diffInHours < 25) {
      return setRelativeTime(
        getCountString({
          count: diffInHours,
          singularString: '{{count}} hour ago',
          otherString: '{{count}} hours ago',
        })
      );
    }
    const diffInDays = differenceInDays(today, date);
    if (diffInDays < 32) {
      return setRelativeTime(
        getCountString({
          count: diffInDays,
          singularString: '{{count}} day ago',
          otherString: '{{count}} days ago',
        })
      );
    }
    const diffInWeeks = differenceInWeeks(today, date);
    if (diffInWeeks < 5) {
      return setRelativeTime(
        getCountString({
          count: diffInWeeks,
          singularString: '{{count}} week ago',
          otherString: '{{count}} weeks ago',
        })
      );
    }
    const diffInMonths = differenceInMonths(today, date);
    if (diffInMonths < 13) {
      return setRelativeTime(
        getCountString({
          count: diffInMonths,
          singularString: '{{count}} month ago',
          otherString: '{{count}} months ago',
        })
      );
    }
    const diffInYears = differenceInYears(today, date);
    setRelativeTime(
      getCountString({
        count: diffInYears,
        singularString: '{{count}} year ago',
        otherString: '{{count}} years ago',
      })
    );
  }, [unparsedDate]);

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
