import { Ref, useRef, useState } from 'react';
import { AlertProps } from '@cloudscape-design/components/alert';
import { TextareaProps } from '@cloudscape-design/components/textarea';
import { RadioGroupProps } from '@cloudscape-design/components/radio-group';
import { SelectProps } from '@cloudscape-design/components/select';
import { InputProps } from '@cloudscape-design/components/input';

import { sendFeedback } from './feedback-api';
import { useFeedback as useFeedbackContext } from '../feedback-context';
import getCountString from 'utilities/get-count-string';

enum Satisfied {
  Yes = 'yes',
  No = 'no',
}

enum Type {
  General = 'general',
  FeatureRequest = 'featureRequest',
  Issue = 'issue',
  UiFeedback = 'uiFeedback',
}

export interface Values {
  email: string;
  message: string;
  satisfied: Satisfied | null;
  type: SelectProps.Option;
}

export default function useFeedback(): State {
  const alertRef = useRef<AlertProps.Ref>(null);
  const emailRef = useRef<InputProps.Ref>(null);
  const messageRef = useRef<TextareaProps.Ref>(null);
  const satisfiedRef = useRef<RadioGroupProps.Ref>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isApiError, setIsApiError] = useState<boolean>(false);
  const { isFeedbackVisible: visible, setIsFeedbackVisible: setVisible } = useFeedbackContext();
  const typeOptions: SelectProps.Option[] = [
    {
      label: 'General feedback',
      value: Type.General,
    },
    {
      label: 'Feature request',
      value: Type.FeatureRequest,
    },
    {
      label: 'Report an issue',
      value: Type.Issue,
    },
    {
      label: 'UI feedback',
      value: Type.UiFeedback,
    },
  ];

  const initialValues: Values = {
    email: '',
    message: '',
    satisfied: null,
    type: typeOptions[0],
  };

  async function handleSubmit(values: Values) {
    setIsApiError(false);
    try {
      await sendFeedback({
        message: values.message,
        type: values.type.value!,
        satisfied: values.satisfied!,
        email: values.email,
      });
      setIsSuccess(true);
    } catch {
      setIsApiError(true);
      alertRef.current?.focus();
    }
  }

  const satisfiedItems: RadioGroupProps.RadioButtonDefinition[] = [
    {
      value: Satisfied.Yes,
      label: 'Yes',
    },
    {
      value: Satisfied.No,
      label: 'No',
    },
  ];

  function getMessageConstraintText(messageValue: string) {
    const remainingCharacters = 1000 - messageValue.length;
    return getCountString({
      singularString: '{{count}} character remaining',
      otherString: '{{count}} characters remaining',
      count: remainingCharacters,
    });
  }

  function handleDismiss(resetFormFn: () => void) {
    setVisible(false);
    setIsSuccess(false);
    setIsApiError(false);
    resetFormFn();
  }

  return {
    alertRef,
    emailRef,
    getMessageConstraintText,
    handleDismiss,
    handleSubmit,
    initialValues,
    isApiError,
    isSuccess,
    messageRef,
    satisfiedItems,
    satisfiedRef,
    typeOptions,
    visible,
  };
}

interface State {
  alertRef: Ref<AlertProps.Ref>;
  emailRef: Ref<InputProps.Ref>;
  getMessageConstraintText: (messageValue: string) => string;
  handleDismiss: (resetFormFn: () => void) => void;
  handleSubmit: (values: Values) => Promise<void>;
  initialValues: Values;
  isApiError: boolean;
  isSuccess: boolean;
  messageRef: Ref<TextareaProps.Ref>;
  satisfiedItems: RadioGroupProps.RadioButtonDefinition[];
  satisfiedRef: Ref<RadioGroupProps.Ref>;
  typeOptions: SelectProps.Options;
  visible: boolean;
}
