import { TopNavigationProps } from '@cloudscape-design/components/top-navigation';
import { AutosuggestProps } from '@cloudscape-design/components/autosuggest';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';
import { useMemo, useState } from 'react';

import { Pathname } from 'utilities/routes';
import useNavigateWithRef from 'common/use-navigate-with-ref';
import { useSearchChannels } from '../apps/twitch/api';

export default function useTopNavigation(): State {
  const navigate = useNavigateWithRef();
  const [filteringText, setFilteringText] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [isSettingsVisible, setIsSettingsVisible] = useState<boolean>(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState<boolean>(false);

  const { data: searchData } = useSearchChannels(filteringText);

  const autoSuggestOptions = useMemo((): AutosuggestProps.Option[] => {
    if (!searchData) {
      return [];
    }
    return searchData.data.map((result) => {
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

  function handleKeyDown(event: NonCancelableCustomEvent<AutosuggestProps.KeyDetail>) {
    if (event.detail.key !== 'Enter') {
      return;
    }
    navigate(`/channel/${searchValue}`);
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
    setFilteringText(event.detail.filteringText);
  }

  function handleSearchChange(event: NonCancelableCustomEvent<AutosuggestProps.ChangeDetail>) {
    setSearchValue(event.detail.value);
  }

  function handleSelect(event: NonCancelableCustomEvent<AutosuggestProps.SelectDetail>) {
    console.log(event);
    navigate(`/channel/${event.detail.value}`);
  }

  return {
    autoSuggestOptions,
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
    searchValue,
    utilities,
  };
}

interface State {
  autoSuggestOptions: AutosuggestProps.Option[];
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
  searchValue: string;
  utilities: TopNavigationProps.Utility[];
}
