import Alert from '@cloudscape-design/components/alert';
import Modal from '@cloudscape-design/components/modal';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import useFeedback, { Values } from './use-feedback';
import FormikInput from 'common/formik/input';
import FormikFormField from 'common/formik/form-field';
import FormikTextArea from 'common/formik/textarea';
import FormikSelect from 'common/formik/select';
import FormikRadioGroup from 'common/formik/radio-group';

export default function Feedback() {
  const {
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
  } = useFeedback();

  return (
    <Formik<Values>
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        message: Yup.string()
          .max(1000, 'Message must be 1,000 characters or fewer.')
          .required('Enter a message.'),
        satisfied: Yup.string().required('Choose a satisfaction.'),
        email: Yup.string().email('Enter a valid email.'),
      })}
      onSubmit={handleSubmit}
    >
      {({ resetForm, isSubmitting, values }) => (
        <Modal
          footer={
            <Box float="right">
              {isSuccess && (
                <Button variant="primary" onClick={() => handleDismiss(resetForm)}>
                  Close
                </Button>
              )}
              {!isSuccess && (
                <SpaceBetween size="xs" direction="horizontal">
                  <Button variant="link" onClick={() => handleDismiss(resetForm)}>
                    Cancel
                  </Button>
                  <Button loading={isSubmitting} variant="primary" form="feedback">
                    Submit
                  </Button>
                </SpaceBetween>
              )}
            </Box>
          }
          header={<Header>Feedback</Header>}
          onDismiss={() => handleDismiss(resetForm)}
          visible={visible}
        >
          <Form id="feedback">
            {isSuccess && <Alert type="success">Successfully submitted feedback.</Alert>}
            {!isSuccess && (
              <SpaceBetween size="l">
                <span>Thank you for taking time to provide feedback.</span>
                <FormikFormField name="type" label="Feedback type">
                  <FormikSelect options={typeOptions} name="type" />
                </FormikFormField>
                <FormikFormField
                  name="message"
                  label="Message"
                  constraintText={getMessageConstraintText(values.message)}
                >
                  <FormikTextArea ref={messageRef} name="message" />
                </FormikFormField>
                <FormikFormField name="satisfied" label="Are you satisfied with your experience?">
                  <FormikRadioGroup name="satisfied" items={satisfiedItems} ref={satisfiedRef} />
                </FormikFormField>
                <FormikFormField
                  name="email"
                  label={
                    <span>
                      Email - <i>optional</i>
                    </span>
                  }
                  description="If you would like to be contacted about your feedback, enter your email address."
                >
                  <FormikInput name="email" ref={emailRef} placeholder="person@email.com" />
                </FormikFormField>
                {isApiError && (
                  <Alert ref={alertRef} type="error">
                    Failed to submit feedback. Try again later.
                  </Alert>
                )}
              </SpaceBetween>
            )}
          </Form>
        </Modal>
      )}
    </Formik>
  );
}
