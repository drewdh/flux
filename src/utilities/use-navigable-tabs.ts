import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';
import { TabsProps } from '@cloudscape-design/components/tabs';
import { useSearchParams } from 'react-router-dom';

export default function useNavigableTabs({ defaultTabId, searchParamKey }: Props): State {
  const [searchParams] = useSearchParams();
  const tabIdParam = searchParams.get(searchParamKey);
  const navigate = useNavigate();
  const [activeTabId, setActiveTabId] = useState<string>(tabIdParam ?? defaultTabId);

  // Let tab id route param be source of truth
  useEffect(() => {
    setActiveTabId(tabIdParam ?? defaultTabId);
  }, [defaultTabId, tabIdParam]);

  function handleChange(event: NonCancelableCustomEvent<TabsProps.ChangeDetail>) {
    const { activeTabHref, activeTabId: newActiveTabId } = event.detail;
    if (activeTabHref) {
      navigate(activeTabHref);
    } else {
      setActiveTabId(newActiveTabId);
    }
  }

  return {
    activeTabId,
    handleChange,
  };
}

interface Props {
  defaultTabId: string;
  searchParamKey: string;
}

interface State {
  activeTabId: string;
  handleChange: (event: NonCancelableCustomEvent<TabsProps.ChangeDetail>) => void;
}
