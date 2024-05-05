import CloudscapeTopNavigation from '@cloudscape-design/components/top-navigation';
import Autosuggest from '@cloudscape-design/components/autosuggest';

import styles from './styles.module.scss';
import { topNavId } from './constants';
import useTopNavigation from './use-top-navigation';
import Feedback from '../feedback/internal/feedback';
import { useTranslation } from 'react-i18next';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import clsx from 'clsx';

export default function TopNavigation() {
  const { t } = useTranslation();
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
            <SpaceBetween size="xs" direction="horizontal">
              <Autosuggest
                ref={autosuggestRef}
                filteringType="manual"
                onChange={handleSearchChange}
                onLoadItems={handleLoadItems}
                onSelect={handleSelect}
                onKeyDown={handleKeyDown}
                placeholder={t('nav.search.placeholder')}
                value={searchInputValue}
                options={autosuggestOptions}
              />
              <Button
                ariaLabel="Search"
                onClick={handleSubmit}
                variant="normal"
                iconName="search"
              />
            </SpaceBetween>
          }
        />
      </div>
      <Feedback />
    </>
  );
}
