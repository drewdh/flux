import { TopNavigationProps } from '@cloudscape-design/components/top-navigation';
import { AutosuggestProps } from '@cloudscape-design/components/autosuggest';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';
import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft } from '@fortawesome/pro-solid-svg-icons';

import { Pathname } from 'utilities/routes';
import useNavigateWithRef from 'common/use-navigate-with-ref';
import { useSearchChannels } from '../api/api';
import useLocalStorage, { LocalStorageKey } from 'utilities/use-local-storage';

export default function useTopNavigation(): State {
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>(
    LocalStorageKey.SearchHistory,
    []
  );
  const [searchParams] = useSearchParams();
  const navigate = useNavigateWithRef();
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [query, setQuery] = useState<string>(searchParams.get('query') ?? '');
  const [isSettingsVisible, setIsSettingsVisible] = useState<boolean>(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState<boolean>(false);

  const { data: searchData } = useSearchChannels({ query: debouncedQuery, pageSize: 10 });

  const autosuggestOptions = useMemo((): AutosuggestProps.Option[] => {
    const searchHistoryOptions: AutosuggestProps.Option[] = searchHistory.map((term) => {
      return {
        iconSvg: <FontAwesomeIcon icon={faClockRotateLeft} />,
        label: term.toLowerCase(),
        value: term.toLowerCase(),
      };
    });
    if (!query) {
      return searchHistoryOptions;
    }
    const searchResultOptions: AutosuggestProps.Option[] =
      searchData?.pages[0].data
        .filter((result) => result.is_live)
        .map((result) => {
          return {
            iconName: 'search',
            label: result.display_name.toLowerCase(),
            value: result.broadcaster_login,
          };
        }) ?? [];
    return [...searchHistoryOptions, ...searchResultOptions].filter(
      (item) => item.label?.includes(query.toLowerCase())
    );
  }, [query, searchData, searchHistory]);

  function handleFeedbackDismiss() {
    setIsFeedbackVisible(false);
  }

  function submitSearch(nextQuery?: string) {
    const finalQuery = nextQuery || query;
    setSearchHistory((prev) => {
      if (prev.includes(finalQuery)) {
        return prev;
      }
      return [finalQuery, ...prev].slice(0, 10);
    });
    navigate({
      pathname: Pathname.Results,
      search: `?query=${finalQuery}`,
    });
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitSearch();
  }

  return {
    autosuggestOptions,
    handleFeedbackDismiss,
    handleLoadItems,
    handleSearchChange,
    handleSelect,
    handleSettingsDismiss,
    handleSubmit,
    i18nStrings,
    identity,
    isFeedbackVisible,
    isSettingsVisible,
    searchInputValue: query,
    utilities,
  };
}

interface State {
  autosuggestOptions: AutosuggestProps.Options;
  handleFeedbackDismiss: () => void;
  handleLoadItems: (event: NonCancelableCustomEvent<AutosuggestProps.LoadItemsDetail>) => void;
  handleSearchChange: (event: NonCancelableCustomEvent<AutosuggestProps.ChangeDetail>) => void;
  handleSelect: (event: NonCancelableCustomEvent<AutosuggestProps.SelectDetail>) => void;
  handleSettingsDismiss: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  i18nStrings: TopNavigationProps.I18nStrings;
  identity: TopNavigationProps.Identity;
  isFeedbackVisible: boolean;
  isSettingsVisible: boolean;
  searchInputValue: string;
  utilities: TopNavigationProps.Utility[];
}
