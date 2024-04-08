import { TopNavigationProps } from '@cloudscape-design/components/top-navigation';
import { AutosuggestProps } from '@cloudscape-design/components/autosuggest';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';
import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft } from '@fortawesome/pro-solid-svg-icons';

import { Pathname } from 'utilities/routes';
import useNavigateWithRef from 'common/use-navigate-with-ref';
import { useRevoke, useSearchCategories, useSearchChannels, useValidate } from '../api/api';
import useLocalStorage, { LocalStorageKey } from 'utilities/use-local-storage';
import useFollow from 'common/use-follow';
import { useTranslation } from 'react-i18next';
import useFeedback from '../feedback/use-feedback';
import { connectHref } from '../pages/home/page';

export default function useTopNavigation(): State {
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>(
    LocalStorageKey.SearchHistory,
    []
  );
  const follow = useFollow();
  const [searchParams] = useSearchParams();
  const navigate = useNavigateWithRef();
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [query, setQuery] = useState<string>(searchParams.get('query') ?? '');

  const { data: channelSearchData } = useSearchChannels({ query: debouncedQuery, pageSize: 5 });
  const { data: gameSearchData } = useSearchCategories({ query: debouncedQuery, pageSize: 5 });
  const { data: scopeData } = useValidate();
  const { mutate: signOut } = useRevoke();

  const autosuggestOptions = useMemo((): AutosuggestProps.Options => {
    const options: AutosuggestProps.OptionGroup[] = [];
    const searchHistoryOptions: AutosuggestProps.Option[] = searchHistory
      .filter((term) => term.toLowerCase().includes(query.toLowerCase()))
      .map((term) => {
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
      channelSearchData?.pages
        .flatMap((page) => page.data)
        .filter((result) => {
          return result.is_live && result.display_name.toLowerCase().includes(query.toLowerCase());
        })
        .map((result) => {
          return {
            iconName: 'search',
            label: result.display_name.toLowerCase(),
            value: result.display_name.toLowerCase(),
          };
        }) ?? [];
    const gameResultOptions: AutosuggestProps.Option[] =
      gameSearchData?.pages
        .flatMap((page) => page.data)
        .filter((result) => result.name.toLowerCase().includes(query.toLowerCase()))
        .map((result) => {
          return {
            iconName: 'search',
            label: result.name.toLowerCase(),
            value: result.name.toLowerCase(),
          };
        }) ?? [];
    if (searchHistoryOptions.length) {
      options.push({
        label: 'Recent',
        options: searchHistoryOptions,
      });
    }
    if (searchResultOptions.length) {
      options.push({
        label: 'Channels',
        options: searchResultOptions,
      });
    }
    if (gameResultOptions.length) {
      options.push({
        label: 'Categories',
        options: gameResultOptions,
      });
    }
    return options;
  }, [searchHistory, query, channelSearchData?.pages, gameSearchData?.pages]);

  function submitSearch(nextQuery?: string) {
    const finalQuery = nextQuery || query;
    setSearchHistory((prev) => {
      if (prev.includes(finalQuery)) {
        return prev;
      }
      return [finalQuery, ...prev].slice(0, 5);
    });
    navigate({
      pathname: Pathname.Results,
      search: `?query=${finalQuery}`,
    });
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

  const utilities: TopNavigationProps.Utility[] = [];

  if (scopeData?.login) {
    utilities.push({
      type: 'menu-dropdown',
      iconName: 'user-profile-active',
      text: scopeData.login,
      onItemFollow: (event) => {
        follow({ href: event.detail.href!, event });
      },
      onItemClick: (event) => {
        console.log('hey');
        if (event.detail.id === 'sign-out') {
          return signOut();
        }
      },
      items: [
        {
          items: [
            {
              id: 'settings',
              iconName: 'settings',
              text: 'Settings',
              href: Pathname.Settings,
            },
          ],
        },
        {
          id: 'sign-out',
          text: 'Sign out',
        },
      ],
    });
  } else {
    utilities.push({
      type: 'button',
      iconName: 'user-profile',
      href: connectHref,
      text: 'Sign in',
    });
  }

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
    handleLoadItems,
    handleSearchChange,
    handleSelect,
    handleSubmit,
    i18nStrings,
    identity,
    searchInputValue: query,
    utilities,
  };
}

interface State {
  autosuggestOptions: AutosuggestProps.Options;
  handleLoadItems: (event: NonCancelableCustomEvent<AutosuggestProps.LoadItemsDetail>) => void;
  handleSearchChange: (event: NonCancelableCustomEvent<AutosuggestProps.ChangeDetail>) => void;
  handleSelect: (event: NonCancelableCustomEvent<AutosuggestProps.SelectDetail>) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  i18nStrings: TopNavigationProps.I18nStrings;
  identity: TopNavigationProps.Identity;
  searchInputValue: string;
  utilities: TopNavigationProps.Utility[];
}
