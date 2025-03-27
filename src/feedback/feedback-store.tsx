import { create } from 'zustand/react';

interface FeedbackStore {
  isFeedbackOpen: boolean;
  closeFeedback: () => void;
  openFeedback: () => void;
}

export const useFeedback = create<FeedbackStore>((set) => ({
  isFeedbackOpen: false,
  closeFeedback: () => set({ isFeedbackOpen: false }),
  openFeedback: () => set({ isFeedbackOpen: true }),
}));
