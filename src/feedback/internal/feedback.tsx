import Alert from '@cloudscape-design/components/alert';
import Modal from '@cloudscape-design/components/modal';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import useFeedback, { Values } from './use-feedback';
import FormikInput from 'common/formik/input';
import FormikFormField from 'common/formik/form-field';
import FormikTextArea from 'common/formik/textarea';
import FormikSelect from 'common/formik/select';
import FormikRadioGroup from 'common/formik/radio-group';

export default function Feedback() {
  const { t } = useTranslation();
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
          .max(1000, t('feedback.error.maxMessage'))
          .required(t('feedback.error.messageRequired')),
        satisfied: Yup.string().required(t('feedback.error.satisfactionRequired')),
        email: Yup.string().email(t('feedback.error.invalidEmail')),
      })}
      onSubmit={handleSubmit}
    >
      {({ resetForm, isSubmitting, values }) => (
        <Modal
          footer={
            <Box float="right">
              {isSuccess && (
                <Button variant="primary" onClick={() => handleDismiss(resetForm)}>
                  {t('common.close')}
                </Button>
              )}
              {!isSuccess && (
                <SpaceBetween size="xs" direction="horizontal">
                  <Button variant="link" onClick={() => handleDismiss(resetForm)}>
                    {t('common.cancel')}
                  </Button>
                  <Button loading={isSubmitting} variant="primary" form="feedback">
                    {t('common.submit')}
                  </Button>
                </SpaceBetween>
              )}
            </Box>
          }
          header={<Header>{t('feedback.title')}</Header>}
          onDismiss={() => handleDismiss(resetForm)}
          visible={visible}
        >
          <Form id="feedback">
            {isSuccess && <Alert type="success">{t('feedback.success')}</Alert>}
            {!isSuccess && (
              <SpaceBetween size="l">
                <span>{t('feedback.description')}</span>
                <FormikFormField name="type" label={t('feedback.typeLabel')}>
                  <FormikSelect options={typeOptions} name="type" />
                </FormikFormField>
                <FormikFormField
                  name="message"
                  label={t('feedback.messageLabel')}
                  constraintText={getMessageConstraintText(values.message)}
                >
                  <FormikTextArea ref={messageRef} name="message" />
                </FormikFormField>
                <FormikFormField name="satisfied" label={t('feedback.satisfactionLabel')}>
                  <FormikRadioGroup name="satisfied" items={satisfiedItems} ref={satisfiedRef} />
                </FormikFormField>
                <FormikFormField
                  name="email"
                  label={
                    <span>
                      {t('feedback.emailLabel')} - <i>{t('common.optional')}</i>
                    </span>
                  }
                  description={t('feedback.emailDescription')}
                >
                  <FormikInput
                    name="email"
                    ref={emailRef}
                    placeholder={t('feedback.emailPlaceholder')}
                  />
                </FormikFormField>
                {isApiError && (
                  <Alert ref={alertRef} type="error">
                    {t('feedback.error.general')}
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
