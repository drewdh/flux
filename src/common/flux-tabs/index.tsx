import React, { createRef, useId, useRef, useState } from 'react';
import { NonCancelableCustomEvent } from '@cloudscape-design/components';
import SpaceBetween from '@cloudscape-design/components/space-between';
import clsx from 'clsx';

import styles from './styles.module.scss';

export default function FluxTabs({ tabs, activeTabId, onChange, label }: FluxTabsProps) {
  const namespaceId = useId();
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const [focusedTabIndex, setFocusedTabIndex] = useState<number>(0);
  const tabRefs = useRef(tabs.map((tab) => createRef<HTMLAnchorElement>()));

  function focusTab(index: number) {
    setFocusedTabIndex(index);
    tabRefs.current[index].current?.focus();
  }

  return (
    <SpaceBetween size="l" direction="vertical">
      <div className={styles.tabsWrapper}>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label={label}
          onKeyDown={(event) => {
            const { key } = event;
            if (key === 'ArrowRight') {
              focusTab(focusedTabIndex === tabs.length - 1 ? 0 : focusedTabIndex + 1);
            } else if (key === 'ArrowLeft') {
              focusTab(focusedTabIndex === 0 ? tabs.length - 1 : focusedTabIndex - 1);
            }
          }}
        >
          {tabs.map((tab, index) => (
            <a
              aria-controls={`${namespaceId}-panel-${tab.id}`}
              aria-selected={activeTabId === tab.id}
              id={`${namespaceId}-tab-${tab.id}`}
              role="tab"
              ref={tabRefs.current[index]}
              href={tab.href}
              onClick={(event) => {
                const isModifierKey =
                  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
                if (isModifierKey) {
                  return;
                }
                event.preventDefault();
                onChange?.(
                  new CustomEvent<FluxTabsProps.ChangeDetail>('', {
                    detail: { activeTabId: tab.id, activeTabHref: tab.href },
                  })
                );
              }}
              className={clsx(styles.tab, activeTabId === tab.id && styles.active)}
              tabIndex={index === focusedTabIndex ? 0 : -1}
            >
              {tab.label}
            </a>
          ))}
        </div>
      </div>
      <div
        aria-labelledby={`${namespaceId}-tab-${activeTabId}`}
        tabIndex={0}
        role="tabpanel"
        id={`${namespaceId}-panel-${activeTabId}`}
      >
        {activeTab?.content}
      </div>
    </SpaceBetween>
  );
}

export declare module FluxTabsProps {
  interface TabDefinition {
    id: string;
    href?: string;
    label?: string;
    content?: React.ReactNode;
  }
  interface ChangeDetail {
    activeTabHref?: string;
    activeTabId: string;
  }
}

interface FluxTabsProps {
  activeTabId: string | null;
  onChange?: (event: NonCancelableCustomEvent<FluxTabsProps.ChangeDetail>) => void;
  label?: string;
  tabs: FluxTabsProps.TabDefinition[];
}
