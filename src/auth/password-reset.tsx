import Form from '@cloudscape-design/components/form';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import FormikInput from 'common/formik/input';
import FormikFormField from 'common/formik/form-field';
import userAuth from 'utilities/user-auth';
import { Pathname } from 'utilities/routes';

interface Values {
  password: string;
  passwordConfirm: string;
}

export default function PasswordReset() {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const email = searchParams.get('email') ?? '';
  const session = searchParams.get('session') ?? '';
  const name = searchParams.get('name') ?? '';
  const navigate = useNavigate() ?? '';

  useEffect(() => {
    if (!email || !session || !name) {
      navigate(Pathname.Signin, { replace: true });
    }
  }, [name, email, session, navigate]);

  return (
    <Formik<Values>
      validationSchema={yup.object({
        password: yup
          .string()
          .required('Enter a password.')
          .min(8, 'Password must contain at least 8 characters.')
          .matches(/.*[0-9].*/, 'Password must contain at least 1 number.')
          .matches(/.*[A-Z].*/, 'Password must contain at least 1 uppercase character.')
          .matches(/.*[a-z].*/, 'Password must contain at least 1 lowercase character.')
          .matches(
            /.*[\^$*.\[\]{}()?\-"!@#%&/\\,><':;|_~`+=].*/,
            'Password must contain at least 1 special character.'
          ),
        passwordConfirm: yup
          .string()
          .required()
          .test({
            test: (value, context) => {
              return value === context.parent.password;
            },
            message: 'Passwords do not match.',
          }),
      })}
      initialValues={{ password: '', passwordConfirm: '' }}
      validateOnChange={isSubmitted}
      onSubmit={async ({ password }) => {
        try {
          const resp = await userAuth.setNewPassword({ email, password, session, name });
        } catch (e) {
          setErrorText((e as Error).message);
        }
      }}
    >
      {({ submitForm, isSubmitting }) => (
        <form onSubmit={(e) => e.preventDefault()}>
          <Form
            actions={
              <SpaceBetween size="xs" direction="horizontal">
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsSubmitted(true);
                    submitForm();
                  }}
                  loading={isSubmitting}
                >
                  Set new password
                </Button>
              </SpaceBetween>
            }
            errorText={errorText}
            header={
              <Header variant="h1" description="Sign in to access administrative tools.">
                Sign in to drewhanberry.com
              </Header>
            }
          >
            <Container
              header={
                <Header description="To protect your account, you need to set a new password.">
                  Set a new password
                </Header>
              }
            >
              {/* This hidden field helps password managers update passwords for the correct username */}
              {email && (
                <input
                  style={{ display: 'none' }}
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                />
              )}
              <SpaceBetween size="l">
                <FormikFormField
                  label="New password"
                  name="password"
                  constraintText="Password must contain 1 number, 1 lowercase character, 1 uppercase character, and 1 special character."
                >
                  <FormikInput name="password" type="password" autoComplete="new-password" />
                </FormikFormField>
                <FormikFormField label="Confirm new password" name="passwordConfirm">
                  <FormikInput name="passwordConfirm" type="password" autoComplete="new-password" />
                </FormikFormField>
              </SpaceBetween>
            </Container>
          </Form>
        </form>
      )}
    </Formik>
  );
}
