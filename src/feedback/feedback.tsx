import Alert from '@cloudscape-design/components/alert';
import Modal from '@cloudscape-design/components/modal';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import FormField from '@cloudscape-design/components/form-field';
import Select from '@cloudscape-design/components/select';
import Textarea from '@cloudscape-design/components/textarea';
import RadioGroup from '@cloudscape-design/components/radio-group';
import Input from '@cloudscape-design/components/input';

import useFeedback from './use-feedback';

export default function Feedback({ visible, onDismiss }: Props) {
  const {
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
  } = useFeedback({ onDismiss });

  return (
    <Modal
      footer={
        <Box float="right">
          {isSuccess && (
            <Button variant="primary" onClick={handleDismiss}>
              Close
            </Button>
          )}
          {!isSuccess && (
            <SpaceBetween size="xs" direction="horizontal">
              <Button variant="link" onClick={handleDismiss}>
                Cancel
              </Button>
              <Button
                loading={isSubmitting}
                variant="primary"
                form="feedback"
                onClick={handleSubmitClick}
              >
                Submit
              </Button>
            </SpaceBetween>
          )}
        </Box>
      }
      header={<Header>Feedback</Header>}
      onDismiss={handleDismiss}
      visible={Boolean(visible)}
    >
      <form id="feedback" onSubmit={(e) => e.preventDefault()}>
        {isSuccess && <Alert type="success">Successfully submitted feedback.</Alert>}
        {!isSuccess && (
          <SpaceBetween size="l">
            <span>Thank you for taking time to provide feedback.</span>
            <FormField label="Feedback type">
              <Select
                selectedOption={values.type}
                onChange={handleTypeChange}
                options={typeOptions}
              />
            </FormField>
            <FormField
              label="Message"
              constraintText={messageConstraintText}
              errorText={errors.message}
            >
              <Textarea ref={messageRef} value={values.message} onChange={handleMessageChange} />
            </FormField>
            <FormField label="Are you satisfied with your experience?" errorText={errors.satisfied}>
              <RadioGroup
                items={satisfiedItems}
                onChange={handleSatisfiedChange}
                value={values.satisfied}
                ref={satisfiedRef}
              />
            </FormField>
            <FormField
              errorText={errors.email}
              label={
                <span>
                  Email - <i>optional</i>
                </span>
              }
              description="If you would like to be contacted about your feedback, enter your email address."
            >
              <Input
                ref={emailRef}
                placeholder="person@email.com"
                value={values.email}
                onChange={handleEmailChange}
              />
            </FormField>
            {isApiError && (
              <Alert ref={alertRef} type="error">
                Failed to submit feedback. Try again later.
              </Alert>
            )}
          </SpaceBetween>
        )}
      </form>
    </Modal>
  );
}

interface Props {
  visible: boolean | undefined;
  onDismiss: () => void;
}
