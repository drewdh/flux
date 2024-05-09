import { createContext, PropsWithChildren, useContext, useState } from 'react';

interface FeedbackState {
  isFeedbackVisible: boolean;
  setIsFeedbackVisible: (visible: boolean) => void;
}

export const FeedbackContext = createContext<FeedbackState>({
  isFeedbackVisible: false,
  setIsFeedbackVisible: () => {},
});

export function FeedbackProvider({ children }: PropsWithChildren) {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState<boolean>(false);

  return (
    <FeedbackContext.Provider value={{ isFeedbackVisible, setIsFeedbackVisible }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackState {
  return useContext(FeedbackContext);
}
