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
import { useTranslation } from 'react-i18next';

import useFeedback from './use-feedback';

export default function Feedback() {
  const { t } = useTranslation();
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
    visible,
  } = useFeedback();

  return (
    <Modal
      footer={
        <Box float="right">
          {isSuccess && (
            <Button variant="primary" onClick={handleDismiss}>
              {t('common.close')}
            </Button>
          )}
          {!isSuccess && (
            <SpaceBetween size="xs" direction="horizontal">
              <Button variant="link" onClick={handleDismiss}>
                {t('common.cancel')}
              </Button>
              <Button
                loading={isSubmitting}
                variant="primary"
                form="feedback"
                onClick={handleSubmitClick}
              >
                {t('common.submit')}
              </Button>
            </SpaceBetween>
          )}
        </Box>
      }
      header={<Header>{t('feedback.title')}</Header>}
      onDismiss={handleDismiss}
      visible={visible}
    >
      <form id="feedback" onSubmit={(e) => e.preventDefault()}>
        {isSuccess && <Alert type="success">{t('feedback.success')}</Alert>}
        {!isSuccess && (
          <SpaceBetween size="l">
            <span>{t('feedback.description')}</span>
            <FormField label={t('feedback.typeLabel')}>
              <Select
                selectedOption={values.type}
                onChange={handleTypeChange}
                options={typeOptions}
              />
            </FormField>
            <FormField
              label={t('feedback.messageLabel')}
              constraintText={messageConstraintText}
              errorText={errors.message}
            >
              <Textarea ref={messageRef} value={values.message} onChange={handleMessageChange} />
            </FormField>
            <FormField label={t('feedback.satisfactionLabel')} errorText={errors.satisfied}>
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
                  {t('feedback.emailLabel')} - <i>{t('common.optional')}</i>
                </span>
              }
              description={t('feedback.emailDescription')}
            >
              <Input
                ref={emailRef}
                placeholder={t('feedback.emailPlaceholder')}
                value={values.email}
                onChange={handleEmailChange}
              />
            </FormField>
            {isApiError && (
              <Alert ref={alertRef} type="error">
                {t('feedback.error.general')}
              </Alert>
            )}
          </SpaceBetween>
        )}
      </form>
    </Modal>
  );
}
