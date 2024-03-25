import { TopNavigationProps } from '@cloudscape-design/components/top-navigation';
import { useState } from 'react';

import { Pathname } from 'utilities/routes';
import useNavigateWithRef from 'common/use-navigate-with-ref';
import useGetCurrentUser from '../auth/use-get-current-user';
import useSignOut from '../auth/use-sign-out';

enum ProfileMenuItemId {
  SignOut = 'signOut',
}

export default function useTopNavigation(): State {
  const navigate = useNavigateWithRef();
  const [isSettingsVisible, setIsSettingsVisible] = useState<boolean>(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState<boolean>(false);

  // const { data: currentUser } = useGetCurrentUser();
  // const { mutate: signOut } = useSignOut();

  function handleFeedbackDismiss() {
    setIsFeedbackVisible(false);
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

  // if (currentUser) {
  //   utilities.push({
  //     type: 'menu-dropdown',
  //     text: currentUser.Username,
  //     iconName: 'user-profile-active',
  //     onItemClick: (event) => {
  //       switch (event.detail.id) {
  //         case ProfileMenuItemId.SignOut: {
  //           signOut();
  //         }
  //       }
  //     },
  //     items: [
  //       {
  //         id: ProfileMenuItemId.SignOut,
  //         text: 'Sign out',
  //       },
  //     ],
  //   });
  // } else {
  //   utilities.push({
  //     type: 'button',
  //     text: 'Sign in',
  //     iconName: 'user-profile',
  //     href: Pathname.Signin,
  //     onFollow: (event) => {
  //       event.preventDefault();
  //       navigate(Pathname.Signin);
  //     },
  //   });
  // }

  return {
    handleFeedbackDismiss,
    handleSettingsDismiss,
    i18nStrings,
    identity,
    isFeedbackVisible,
    isSettingsVisible,
    utilities,
  };
}

interface State {
  handleFeedbackDismiss: () => void;
  handleSettingsDismiss: () => void;
  i18nStrings: TopNavigationProps.I18nStrings;
  identity: TopNavigationProps.Identity;
  isFeedbackVisible: boolean;
  isSettingsVisible: boolean;
  utilities: TopNavigationProps.Utility[];
}
