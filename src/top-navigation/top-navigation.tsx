import CloudscapeTopNavigation from '@cloudscape-design/components/top-navigation';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import SpaceBetween from '@cloudscape-design/components/space-between';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { topNavId } from './constants';
import useTopNavigation from './use-top-navigation';
import Feedback from '../feedback/internal/feedback';

export default function TopNavigation() {
  const {
    autosuggestRef,
    autosuggestOptions,
    handleKeyDown,
    handleLoadItems,
    handleSearchChange,
    handleSelect,
    handleSubmit,
    i18nStrings,
    identity,
    searchHidden,
    searchInputValue,
    utilities,
  } = useTopNavigation();

  return (
    <>
      <div className={clsx(styles.topNavigation, 'awsui-context-top-navigation')} id={topNavId}>
        <CloudscapeTopNavigation
          identity={identity}
          i18nStrings={i18nStrings}
          utilities={utilities}
          search={
            !searchHidden && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <SpaceBetween size="xs" direction="horizontal">
                  <Autosuggest
                    enteredTextLabel={(value) => `Search for "${value}"`}
                    ref={autosuggestRef}
                    filteringType="manual"
                    onChange={handleSearchChange}
                    onLoadItems={handleLoadItems}
                    onSelect={handleSelect}
                    onKeyDown={handleKeyDown}
                    placeholder="Search live streams"
                    value={searchInputValue}
                    options={autosuggestOptions}
                  />
                </SpaceBetween>
              </form>
            )
          }
        />
      </div>
      <Feedback />
    </>
  );
}
