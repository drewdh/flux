import Table from '@cloudscape-design/components/table';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';

import useLocalStorage, { LocalStorageKey } from 'utilities/use-local-storage';
import Empty from 'common/empty/empty';
import { useMemo, useState } from 'react';
import Modal from '@cloudscape-design/components/modal';
import Alert from '@cloudscape-design/components/alert';

enum ColumnId {
  Term = 'term',
  Action = 'action',
}
interface Item {
  term: string;
  index: number;
}

export default function RecentSearches() {
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>(
    LocalStorageKey.SearchHistory,
    []
  );
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [searchHistoryEnabled, setSearchHistoryEnabled] = useLocalStorage<boolean>(
    LocalStorageKey.SearchHistoryEnabled,
    true
  );
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);

  const counter = useMemo((): string => {
    if (!searchHistoryEnabled) {
      return '';
    }
    if (!selectedItems.length) {
      return `(${searchHistory.length})`;
    }
    return `(${selectedItems.length}/${searchHistory.length})`;
  }, [searchHistoryEnabled, selectedItems.length, searchHistory.length]);

  function toggleEnabled() {
    setSearchHistoryEnabled((prev) => !prev);
  }

  function deleteItems(items: Item[]) {
    setSearchHistory((prev) => {
      return prev.filter((_item, index) => {
        return !items.some((item) => item.index === index);
      });
    });
  }

  const items: Item[] = searchHistory.map((term, index) => {
    return {
      term,
      index,
    };
  });

  return (
    <>
      <Table<Item>
        enableKeyboardNavigation
        selectionType="multi"
        trackBy="index"
        onSelectionChange={(event) => setSelectedItems(event.detail.selectedItems)}
        empty={
          searchHistoryEnabled ? (
            <Empty header="No recent searches" />
          ) : (
            <Empty
              header="No recent searches"
              message="Recent searches is disabled."
              action={
                <Button onClick={() => setSearchHistoryEnabled(true)}>
                  Enable recent searches
                </Button>
              }
            />
          )
        }
        items={items}
        columnDefinitions={[
          {
            id: ColumnId.Term,
            cell: (term) => term.term,
            header: 'Search',
          },
          {
            id: ColumnId.Action,
            header: <div style={{ textAlign: 'right' }}>Actions</div>,
            cell: (term) => (
              <Box textAlign="right">
                <Button
                  variant="inline-icon"
                  iconName="close"
                  onClick={() => deleteItems([term])}
                />
              </Box>
            ),
          },
        ]}
        selectedItems={selectedItems}
        stickyColumns={{ last: 1 }}
        header={
          <Header
            counter={counter}
            description="Store your 5 most recent searches."
            actions={
              <SpaceBetween size="xs" direction="horizontal">
                <Button
                  onClick={() => {
                    deleteItems(selectedItems);
                    setSelectedItems([]);
                  }}
                  disabled={!selectedItems.length}
                >
                  Delete
                </Button>
                {!searchHistoryEnabled && (
                  <Button onClick={() => setSearchHistoryEnabled(true)}>
                    Enable recent searches
                  </Button>
                )}
                {searchHistoryEnabled && (
                  <Button onClick={() => setConfirmModalVisible(true)}>
                    Disable recent searches
                  </Button>
                )}
              </SpaceBetween>
            }
          >
            Recent searches
          </Header>
        }
      />
      <Modal
        onDismiss={() => setConfirmModalVisible(false)}
        visible={confirmModalVisible}
        footer={
          <Box float="right">
            <SpaceBetween size="xs" direction="horizontal">
              <Button onClick={() => setConfirmModalVisible(false)} variant="link">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setSearchHistoryEnabled(false);
                  deleteItems(items);
                  setConfirmModalVisible(false);
                }}
                variant="primary"
              >
                Disable
              </Button>
            </SpaceBetween>
          </Box>
        }
        header={<Header>Disable recent searches</Header>}
      >
        <SpaceBetween size="s">
          <span>Disable recent searches?</span>
          <Alert>Proceeding with this action will delete all recent searches.</Alert>
        </SpaceBetween>
      </Modal>
    </>
  );
}
