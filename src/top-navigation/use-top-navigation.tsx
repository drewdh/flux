import { TopNavigationProps } from '@cloudscape-design/components/top-navigation';
import { AutosuggestProps } from '@cloudscape-design/components/autosuggest';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocation } from 'react-router';
import Icon from '@cloudscape-design/components/icon';

import { interpolatePathname, Pathname } from 'utilities/routes';
import useNavigateWithRef from 'common/use-navigate-with-ref';
import { useGetStreams, useRevoke, useSearchChannels, useValidate } from '../api/api';
import useFollow from 'common/use-follow';
import { connectHref } from '../pages/home/page';
import { useFeedback } from '../feedback/feedback-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/pro-solid-svg-icons/faMoon';
import { Appearance, useSettings } from 'utilities/settings';
import { faRightFromBracket } from '@fortawesome/pro-solid-svg-icons';

enum MenuItemId {
  Feedback = 'feedback',
  SignOut = 'signOut',
  Settings = 'settings',
  LightMode = 'lightMode',
  DarkMode = 'darkMode',
  DefaultAppearance = 'defaultAppearance',
}

export default function useTopNavigation(): State {
  const { setIsFeedbackVisible } = useFeedback();
  const { appearance, setAppearance } = useSettings();
  const isNavigating = useRef<boolean>(false);
  const follow = useFollow();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigateWithRef();
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [query, setQuery] = useState<string>(searchParams.get('query') ?? '');
  const autosuggestRef = useRef<AutosuggestProps.Ref>(null);

  const { data: channelSearchData } = useSearchChannels({ query: debouncedQuery, pageSize: 5 });
  const { data: streamData } = useGetStreams(
    { userIds: channelSearchData?.pages.flatMap((page) => page.data).map((stream) => stream.id) },
    { enabled: !!channelSearchData }
  );
  const { data: scopeData } = useValidate();
  const { mutate: signOut } = useRevoke();

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
          const thisStreamData = streamData?.data.find((stream) => stream.user_id === result.id);
          const viewerCount = thisStreamData?.viewer_count ?? 0;
          return {
            label: result.display_name,
            tags: [`${formatter.format(viewerCount)} watching`, result.game_name],
            value: result.display_name.toLowerCase(),
          };
        }) ?? []
    );
  }, [query, channelSearchData?.pages, streamData?.data]);

  function submitSearch(nextQuery?: string) {
    const finalQuery = nextQuery || query;
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

  const utilities: TopNavigationProps.Utility[] = [
    {
      type: 'menu-dropdown',
      iconSvg: <Icon svg={<FontAwesomeIcon icon={faMoon} />} />,
      title: 'Appearance',
      onItemClick: (event) => {
        const { id } = event.detail;
        const appearances: Record<string, Appearance> = {
          [MenuItemId.LightMode]: Appearance.Light,
          [MenuItemId.DarkMode]: Appearance.Dark,
          [MenuItemId.DefaultAppearance]: Appearance.System,
        };
        setAppearance(appearances[id]);
      },
      items: [
        {
          id: MenuItemId.LightMode,
          text: 'Light',
          iconName: appearance === Appearance.Light ? 'check' : undefined,
        },
        {
          id: MenuItemId.DarkMode,
          text: 'Dark',
          iconName: appearance === Appearance.Dark ? 'check' : undefined,
        },
        {
          id: MenuItemId.DefaultAppearance,
          text: 'Use system settings',
          iconName: appearance === Appearance.System ? 'check' : undefined,
        },
      ],
      // text: 'Feedback',
      // onClick: () => setIsFeedbackVisible(true),
    },
  ];

  if (scopeData?.login) {
    utilities.push({
      type: 'menu-dropdown',
      // iconName: 'user-profile-active',
      text: scopeData.login,
      onItemFollow: (event) => {
        follow({ href: event.detail.href!, event });
      },
      onItemClick: (event) => {
        if (event.detail.id === MenuItemId.SignOut) {
          return signOut();
        }
        if (event.detail.id === MenuItemId.Feedback) {
          setIsFeedbackVisible(true);
        }
      },
      items: [
        {
          id: MenuItemId.Settings,
          text: 'Settings',
          iconName: 'settings',
          href: Pathname.Settings,
        },
        {
          id: MenuItemId.Feedback,
          text: 'Send feedback',
          iconName: 'contact',
        },
        {
          id: MenuItemId.SignOut,
          text: 'Sign out',
          iconSvg: <FontAwesomeIcon icon={faRightFromBracket} />,
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
    i18nStrings,
    identity,
    searchInputValue: query,
    utilities,
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
  i18nStrings: TopNavigationProps.I18nStrings;
  identity: TopNavigationProps.Identity;
  searchInputValue: string;
  utilities: TopNavigationProps.Utility[];
}
