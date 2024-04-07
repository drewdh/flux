export function openFeedback(initialValues: Values = {}) {
  const event = new CustomEvent<Values>('openfeedback', { detail: initialValues });
  document.dispatchEvent(event);
}

export default function useFeedback(): State {
  return {
    openFeedback,
  };
}

export enum Satisfied {
  Yes = 'yes',
  No = 'no',
}
export interface Values {
  message?: string;
  satisfied?: Satisfied;
  email?: string;
}
interface State {
  openFeedback: () => void;
}
