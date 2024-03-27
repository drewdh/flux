import { TopNavigationProps } from '@cloudscape-design/components/top-navigation';
import { AutosuggestProps } from '@cloudscape-design/components/autosuggest';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';
import { Ref, useMemo, useState } from 'react';

import { Pathname } from 'utilities/routes';
import useNavigateWithRef from 'common/use-navigate-with-ref';
import { useSearchChannels } from '../api/api';
import { useLocation } from 'react-router';

export default function useTopNavigation(): State {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const navigate = useNavigateWithRef();
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [query, setQuery] = useState<string>(searchParams.get('query') ?? '');
  const [isSettingsVisible, setIsSettingsVisible] = useState<boolean>(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState<boolean>(false);

  const { data: searchData } = useSearchChannels({ query: debouncedQuery, pageSize: 10 });

  const autosuggestOptions = useMemo((): AutosuggestProps.Option[] => {
    if (!searchData) {
      return [];
    }
    return searchData.pages[0].data.map((result) => {
      return {
        iconName: 'search',
        label: result.display_name.toLowerCase(),
        value: result.broadcaster_login,
      };
    });
  }, [searchData]);

  function handleFeedbackDismiss() {
    setIsFeedbackVisible(false);
  }

  function submitSearch(nextQuery?: string) {
    navigate({
      pathname: Pathname.Results,
      search: `?query=${nextQuery || query}`,
    });
  }

  function handleKeyDown(event: NonCancelableCustomEvent<AutosuggestProps.KeyDetail>) {
    if (event.detail.key !== 'Enter') {
      return;
    }
    submitSearch();
  }

  function handleSettingsDismiss() {
    setIsSettingsVisible(false);
  }

  const i18nStrings: TopNavigationProps.I18nStrings = {
    overflowMenuTriggerText: 'More',
    overflowMenuTitleText: 'All',
  };

  const identity: TopNavigationProps.Identity = {
    title: 'Flux',
    href: Pathname.Home,
    onFollow: (event) => {
      event.preventDefault();
      navigate(Pathname.Home);
    },
  };

  const utilities: TopNavigationProps.Utility[] = [
    {
      type: 'button',
      iconName: 'contact',
      text: 'Feedback',
      title: 'Feedback',
      onClick() {
        setIsFeedbackVisible(true);
      },
    },
    {
      type: 'button',
      iconName: 'settings',
      title: 'Settings',
      onClick() {
        setIsSettingsVisible(true);
      },
    },
  ];

  function handleLoadItems(event: NonCancelableCustomEvent<AutosuggestProps.LoadItemsDetail>) {
    setDebouncedQuery(event.detail.filteringText);
  }

  function handleSearchChange(event: NonCancelableCustomEvent<AutosuggestProps.ChangeDetail>) {
    setQuery(event.detail.value);
  }

  function handleSelect(event: NonCancelableCustomEvent<AutosuggestProps.SelectDetail>) {
    submitSearch(event.detail.value);
  }

  return {
    autosuggestOptions,
    handleFeedbackDismiss,
    handleKeyDown,
    handleLoadItems,
    handleSearchChange,
    handleSelect,
    handleSettingsDismiss,
    i18nStrings,
    identity,
    isFeedbackVisible,
    isSettingsVisible,
    searchInputValue: query,
    utilities,
  };
}

interface State {
  autosuggestOptions: AutosuggestProps.Option[];
  handleFeedbackDismiss: () => void;
  handleKeyDown: (event: NonCancelableCustomEvent<AutosuggestProps.KeyDetail>) => void;
  handleLoadItems: (event: NonCancelableCustomEvent<AutosuggestProps.LoadItemsDetail>) => void;
  handleSearchChange: (event: NonCancelableCustomEvent<AutosuggestProps.ChangeDetail>) => void;
  handleSelect: (event: NonCancelableCustomEvent<AutosuggestProps.SelectDetail>) => void;
  handleSettingsDismiss: () => void;
  i18nStrings: TopNavigationProps.I18nStrings;
  identity: TopNavigationProps.Identity;
  isFeedbackVisible: boolean;
  isSettingsVisible: boolean;
  searchInputValue: string;
  utilities: TopNavigationProps.Utility[];
}
