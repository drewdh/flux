import { Ref, useRef, useState } from 'react';
import { AlertProps, NonCancelableCustomEvent } from '@cloudscape-design/components';
import { TextareaProps } from '@cloudscape-design/components/textarea';
import { RadioGroupProps } from '@cloudscape-design/components/radio-group';
import { SelectProps } from '@cloudscape-design/components/select';
import { FormikErrors, useFormik } from 'formik';
import * as Yup from 'yup';

import { sendFeedback } from './feedback-api';
import { InputProps } from '@cloudscape-design/components/input';

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

interface Values {
  email: string;
  message: string;
  satisfied: Satisfied | null;
  type: SelectProps.Option;
}

const validationSchema = Yup.object().shape({
  message: Yup.string()
    .max(1000, 'Message must be 1,000 characters or fewer.')
    .required('Enter a message.'),
  satisfied: Yup.string().required('Choose a satisfaction.'),
  email: Yup.string().email('Enter a valid email.'),
});

export default function useFeedback({ onDismiss }: Props): State {
  const alertRef = useRef<AlertProps.Ref>(null);
  const emailRef = useRef<InputProps.Ref>(null);
  const messageRef = useRef<TextareaProps.Ref>(null);
  const satisfiedRef = useRef<RadioGroupProps.Ref>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isApiError, setIsApiError] = useState<boolean>(false);
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

  const { errors, handleSubmit, isSubmitting, resetForm, setFieldValue, validateForm, values } =
    useFormik<Values>({
      initialValues: {
        email: '',
        message: '',
        satisfied: null,
        type: typeOptions[0],
      },
      validateOnChange: isSubmitted,
      validationSchema,
      onSubmit: async (values) => {
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
      },
    });

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

  function handleEmailChange(event: NonCancelableCustomEvent<InputProps.ChangeDetail>) {
    setFieldValue('email', event.detail.value);
  }

  function handleTypeChange(event: NonCancelableCustomEvent<SelectProps.ChangeDetail>) {
    setFieldValue('type', event.detail.selectedOption);
  }

  function handleMessageChange(event: NonCancelableCustomEvent<TextareaProps.ChangeDetail>) {
    setFieldValue('message', event.detail.value);
  }

  function handleSatisfiedChange(event: NonCancelableCustomEvent<RadioGroupProps.ChangeDetail>) {
    setFieldValue('satisfied', event.detail.value as Satisfied);
  }

  const remainingCharacters = 1000 - values.message.length;
  const characterString = remainingCharacters === 1 ? 'character' : 'characters';
  const messageConstraintText = `${remainingCharacters.toLocaleString()} ${characterString} remaining`;

  async function handleSubmitClick() {
    setIsSubmitted(true);
    const errors = await validateForm();
    handleSubmit();
    if ('message' in errors) {
      return messageRef.current?.focus();
    }
    if ('satisfied' in errors) {
      return satisfiedRef.current?.focus();
    }
    if ('email' in errors) {
      return emailRef.current?.focus();
    }
  }

  function handleDismiss() {
    onDismiss();
    setIsSubmitted(false);
    setIsSuccess(false);
    setIsApiError(false);
    resetForm();
  }

  return {
    alertRef,
    emailRef,
    errors,
    handleDismiss,
    handleEmailChange,
    handleMessageChange,
    handleSatisfiedChange,
    handleSubmitClick,
    handleTypeChange,
    isApiError,
    isSubmitting,
    isSuccess,
    messageConstraintText,
    messageRef,
    satisfiedItems,
    satisfiedRef,
    typeOptions,
    values,
  };
}

interface Props {
  onDismiss: () => void;
}

interface State {
  alertRef: Ref<AlertProps.Ref>;
  emailRef: Ref<InputProps.Ref>;
  errors: FormikErrors<Values>;
  handleDismiss: () => void;
  handleEmailChange: (event: NonCancelableCustomEvent<InputProps.ChangeDetail>) => void;
  handleMessageChange: (event: NonCancelableCustomEvent<TextareaProps.ChangeDetail>) => void;
  handleSatisfiedChange: (event: NonCancelableCustomEvent<RadioGroupProps.ChangeDetail>) => void;
  handleSubmitClick: () => void;
  handleTypeChange: (event: NonCancelableCustomEvent<SelectProps.ChangeDetail>) => void;
  isApiError: boolean;
  isSubmitting: boolean;
  isSuccess: boolean;
  messageConstraintText: string | undefined;
  messageRef: Ref<TextareaProps.Ref>;
  satisfiedItems: RadioGroupProps.RadioButtonDefinition[];
  satisfiedRef: Ref<RadioGroupProps.Ref>;
  typeOptions: SelectProps.Options;
  values: Values;
}
