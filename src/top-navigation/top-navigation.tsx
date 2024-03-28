import CloudscapeTopNavigation from '@cloudscape-design/components/top-navigation';
import Autosuggest from '@cloudscape-design/components/autosuggest';

import styles from './styles.module.scss';
import { topNavId } from './constants';
import useTopNavigation from './use-top-navigation';
import Settings from '../settings/settings';
import Feedback from '../feedback/feedback';

export default function TopNavigation() {
  const {
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
    searchInputValue,
    utilities,
  } = useTopNavigation();

  return (
    <>
      <div className={styles.topNavigation} id={topNavId}>
        <CloudscapeTopNavigation
          identity={identity}
          i18nStrings={i18nStrings}
          utilities={utilities}
          search={
            <form onSubmit={handleSubmit}>
              <Autosuggest
                filteringType="manual"
                onChange={handleSearchChange}
                onLoadItems={handleLoadItems}
                onSelect={handleSelect}
                placeholder="Search live channels"
                value={searchInputValue}
                options={autosuggestOptions}
              />
            </form>
          }
        />
      </div>
      <Settings visible={isSettingsVisible} onDismiss={handleSettingsDismiss} />
      <Feedback visible={isFeedbackVisible} onDismiss={handleFeedbackDismiss} />
    </>
  );
}
