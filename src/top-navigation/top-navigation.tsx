import CloudscapeTopNavigation from '@cloudscape-design/components/top-navigation';
import Autosuggest from '@cloudscape-design/components/autosuggest';

import styles from './styles.module.scss';
import { topNavId } from './constants';
import useTopNavigation from './use-top-navigation';
import Feedback from '../feedback/internal/feedback';
import { useTranslation } from 'react-i18next';

export default function TopNavigation() {
  const { t } = useTranslation();
  const {
    autosuggestOptions,
    handleKeyDown,
    handleLoadItems,
    handleSearchChange,
    handleSelect,
    i18nStrings,
    identity,
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
            <Autosuggest
              filteringType="manual"
              onChange={handleSearchChange}
              onLoadItems={handleLoadItems}
              onSelect={handleSelect}
              onKeyDown={handleKeyDown}
              placeholder={t('nav.search.placeholder')}
              value={searchInputValue}
              options={autosuggestOptions}
            />
          }
        />
      </div>
      <Feedback />
    </>
  );
}
