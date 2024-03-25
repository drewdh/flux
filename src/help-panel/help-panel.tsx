import { createContext, PropsWithChildren, ReactNode, useContext } from 'react';

interface HelpPanelConfig {
  content: ReactNode;
  setContent: (content: ReactNode) => void;
  openPanel: () => void;
}

const defaultConfig: HelpPanelConfig = {
  content: undefined,
  setContent: () => {},
  openPanel: () => {},
};

const HelpPanelContext = createContext<HelpPanelConfig>(defaultConfig);

export function useHelpPanel(): HelpPanelConfig {
  const { content, openPanel, setContent } = useContext(HelpPanelContext);
  return {
    content,
    openPanel,
    setContent,
  };
}

export function HelpPanelProvider({
  children,
  config,
}: PropsWithChildren<ProviderProps>) {
  return (
    <HelpPanelContext.Provider value={config}>
      {children}
    </HelpPanelContext.Provider>
  );
}

interface ProviderProps {
  config: HelpPanelConfig;
}
