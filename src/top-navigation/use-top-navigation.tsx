import { TopNavigationProps } from '@cloudscape-design/components/top-navigation';
import { useQueryClient } from '@tanstack/react-query';

import { Pathname } from 'utilities/routes';
import useNavigateWithRef from 'common/use-navigate-with-ref';
import { useRevoke, useValidate } from '../api/api';
import useFollow from 'common/use-follow';
import { useFeedback } from '../feedback/feedback-store';

enum MenuItemId {
  Feedback = 'feedback',
  SignOut = 'signOut',
  Help = 'help',
}

export default function useTopNavigation(): State {
  const openFeedback = useFeedback((state) => state.openFeedback);
  const queryClient = useQueryClient();
  const follow = useFollow();
  const navigate = useNavigateWithRef();

  const { data: scopeData } = useValidate();
  const { mutate: signOut } = useRevoke();

  const i18nStrings: TopNavigationProps.I18nStrings = {
    overflowMenuTriggerText: 'More',
    overflowMenuTitleText: 'All',
  };

  const identity: TopNavigationProps.Identity = {
    title: 'Flux',
    href: Pathname.Home,
    onFollow: async (event) => {
      event.preventDefault();
      // Clicking this logo should be like reloading the page, so let's invalidate all queries
      await queryClient.invalidateQueries();
      navigate(Pathname.Home);
    },
  };

  const utilities: TopNavigationProps.Utility[] = [
    {
      type: 'button',
      iconName: 'settings',
      href: Pathname.Settings,
      onFollow: (event) => {
        follow({ href: event.detail.href!, event });
      },
    },
  ];

  if (scopeData?.login) {
    utilities.push({
      type: 'menu-dropdown',
      iconName: 'user-profile-active',
      ariaLabel: 'Account menu',
      title: scopeData.login,
      onItemFollow: (event) => {
        follow({ href: event.detail.href!, event });
      },
      onItemClick: (event) => {
        const { id } = event.detail;
        if (id === MenuItemId.SignOut) {
          signOut();
        } else if (id === MenuItemId.Feedback) {
          openFeedback();
        }
      },
      items: [
        {
          id: MenuItemId.SignOut,
          text: 'Sign out',
        },
        {
          id: MenuItemId.Help,
          text: 'Help',
          href: Pathname.Help,
        },
        {
          id: MenuItemId.Feedback,
          text: 'Send feedback',
        },
      ],
    });
  } else {
    // utilities.push({
    //   type: 'button',
    //   iconName: 'user-profile',
    //   href: connectHref,
    //   text: 'Sign in',
    // });
  }

  return {
    i18nStrings,
    identity,
    utilities,
  };
}

interface State {
  i18nStrings: TopNavigationProps.I18nStrings;
  identity: TopNavigationProps.Identity;
  utilities: TopNavigationProps.Utility[];
}
