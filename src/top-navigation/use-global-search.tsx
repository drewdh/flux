import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { AutosuggestProps } from '@cloudscape-design/components/autosuggest';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';
import { useLocation } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { interpolatePathname, Pathname } from 'utilities/routes';
import { useSearchCategories, useSearchChannels, useValidate } from '../api/api';
import useNavigateWithRef from 'common/use-navigate-with-ref';

const pageSize = 5;

export default function useGlobalSearch(): State {
  const isNavigating = useRef<boolean>(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [query, setQuery] = useState<string>(searchParams.get('query') ?? '');
  const autosuggestRef = useRef<AutosuggestProps.Ref>(null);
  const navigate = useNavigateWithRef();

  const { data: scopeData } = useValidate();
  const { data: streamResults } = useSearchChannels({ query: debouncedQuery, pageSize });
  const { data: gameResults } = useSearchCategories({ query: debouncedQuery, pageSize });

  useEffect(() => {
    isNavigating.current = false;
  }, [location]);

  useEffect(() => {
    function eventListener(event: KeyboardEvent) {
      if (event.key === '/') {
        // Don't trigger shortcut if body isn't focused
        if (document.activeElement?.tagName !== 'BODY') {
          return;
        }
        event.preventDefault();
        autosuggestRef.current!.focus();
      }
    }
    document.addEventListener('keydown', eventListener);
    return () => {
      document.removeEventListener('keydown', eventListener);
    };
  }, []);

  const autosuggestOptions = useMemo((): AutosuggestProps.Options => {
    if (!query || !debouncedQuery) {
      return [];
    }
    const options: Array<AutosuggestProps.Option | AutosuggestProps.OptionGroup> = [];
    const gameOptions: AutosuggestProps.Option[] =
      gameResults?.pages
        .flatMap((page) => page.data)
        .map((game) => {
          return {
            label: game.name,
            value: `gameId:${game.id}`,
          };
        }) ?? [];
    const streamOptions: AutosuggestProps.Option[] =
      streamResults?.pages
        .flatMap((page) => page.data)
        .map((stream) => {
          return {
            label: stream.display_name,
            labelTag: stream.game_name,
            value: `login:${stream.broadcaster_login}`,
          };
        }) ?? [];
    if (streamOptions.length) {
      options.push({ label: 'Live channels', options: streamOptions });
    }
    if (gameOptions.length) {
      options.push({ label: 'Categories', options: gameOptions });
    }
    return options;
  }, [query, gameResults, streamResults]);

  function submitSearch(nextQuery?: string) {
    const finalQuery = nextQuery || query;
    const finalSearchParams = new URLSearchParams(searchParams);
    finalSearchParams.set('query', finalQuery);
    navigate({
      pathname: Pathname.Results,
      search: `?${finalSearchParams.toString()}`,
    });
  }

  function handleLoadItems(event: NonCancelableCustomEvent<AutosuggestProps.LoadItemsDetail>) {
    setDebouncedQuery(event.detail.filteringText);
  }

  function handleSearchChange(event: NonCancelableCustomEvent<AutosuggestProps.ChangeDetail>) {
    setQuery(event.detail.value);
  }

  function handleSelect(event: NonCancelableCustomEvent<AutosuggestProps.SelectDetail>) {
    const { value: rawValue, selectedOption } = event.detail;
    const delimiterIndex = rawValue.indexOf(':');
    const type = rawValue.slice(0, delimiterIndex);
    const value = rawValue.slice(delimiterIndex + 1);
    if (selectedOption) {
      const pathname =
        type === 'gameId'
          ? interpolatePathname(Pathname.Game, { gameId: value })
          : interpolatePathname(Pathname.Live, { user: value });
      navigate(pathname);
      setQuery('');
      isNavigating.current = true;
    } else {
      submitSearch(value);
    }
  }

  function handleKeyDown(event: CustomEvent<AutosuggestProps.KeyDetail>) {
    // Prevent submitting if already navigating (e.g., when selecting by pressing Enter)
    if (event.detail.key === 'Enter' && !isNavigating.current) {
      submitSearch();
    }
  }

  function handleSubmit() {
    submitSearch();
  }

  return {
    autosuggestRef,
    autosuggestOptions,
    handleKeyDown,
    handleLoadItems,
    handleSearchChange,
    handleSelect,
    handleSubmit,
    searchInputValue: query,
    searchHidden: !scopeData?.login,
  };
}

interface State {
  autosuggestRef: RefObject<AutosuggestProps.Ref | null>;
  autosuggestOptions: AutosuggestProps.Options;
  handleKeyDown: (event: CustomEvent<AutosuggestProps.KeyDetail>) => void;
  handleLoadItems: (event: NonCancelableCustomEvent<AutosuggestProps.LoadItemsDetail>) => void;
  handleSearchChange: (event: NonCancelableCustomEvent<AutosuggestProps.ChangeDetail>) => void;
  handleSelect: (event: NonCancelableCustomEvent<AutosuggestProps.SelectDetail>) => void;
  handleSubmit: () => void;
  searchHidden: boolean;
  searchInputValue: string;
}
