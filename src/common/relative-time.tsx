import { useCallback, useEffect, useMemo, useState } from 'react';
import { differenceInHours, differenceInMinutes, differenceInSeconds, format } from 'date-fns';

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
      return setRelativeTime(`${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`);
    }
    const diffInHours = differenceInHours(today, date);
    if (diffInHours < 25) {
      return setRelativeTime(`${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`);
    }
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
