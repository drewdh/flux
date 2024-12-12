import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { AutosuggestProps } from '@cloudscape-design/components/autosuggest';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';
import { useLocation } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { interpolatePathname, Pathname } from 'utilities/routes';
import { useGetStreams, useSearchChannels, useValidate } from '../api/api';
import useNavigateWithRef from 'common/use-navigate-with-ref';

export default function useGlobalSearch(): State {
  const isNavigating = useRef<boolean>(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [query, setQuery] = useState<string>(searchParams.get('query') ?? '');
  const autosuggestRef = useRef<AutosuggestProps.Ref>(null);
  const navigate = useNavigateWithRef();

  const { data: scopeData } = useValidate();
  const { data: channelSearchData } = useSearchChannels({ query: debouncedQuery, pageSize: 5 });
  const { data: streamData } = useGetStreams(
    { userIds: channelSearchData?.pages.flatMap((page) => page.data).map((stream) => stream.id) },
    { enabled: !!channelSearchData }
  );

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
    if (!query) {
      return [];
    }
    const formatter = new Intl.NumberFormat(undefined, { notation: 'compact' });
    return (
      channelSearchData?.pages
        .flatMap((page) => page.data)
        .filter((result) => result.is_live)
        .map((result) => {
          const thisStreamData = streamData?.pages
            .flatMap((page) => page.data)
            .find((stream) => stream.user_id === result.id);
          const viewerCount = thisStreamData?.viewer_count ?? 0;
          return {
            label: result.display_name,
            tags: [`${formatter.format(viewerCount)} watching`, result.game_name],
            value: result.display_name.toLowerCase(),
          };
        }) ?? []
    );
  }, [query, channelSearchData?.pages, streamData?.pages]);

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
    const { value, selectedOption } = event.detail;
    if (selectedOption) {
      navigate(interpolatePathname(Pathname.Live, { user: value }));
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
  autosuggestRef: RefObject<AutosuggestProps.Ref>;
  autosuggestOptions: AutosuggestProps.Options;
  handleKeyDown: (event: CustomEvent<AutosuggestProps.KeyDetail>) => void;
  handleLoadItems: (event: NonCancelableCustomEvent<AutosuggestProps.LoadItemsDetail>) => void;
  handleSearchChange: (event: NonCancelableCustomEvent<AutosuggestProps.ChangeDetail>) => void;
  handleSelect: (event: NonCancelableCustomEvent<AutosuggestProps.SelectDetail>) => void;
  handleSubmit: () => void;
  searchHidden: boolean;
  searchInputValue: string;
}
