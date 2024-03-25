import Form from '@cloudscape-design/components/form';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useLocation, useNavigate } from 'react-router';

import { Pathname } from 'utilities/routes';
import FormikInput from 'common/formik/input';
import FormikFormField from 'common/formik/form-field';
import userAuth from 'utilities/user-auth';
import useGetCurrentUser from './use-get-current-user';

interface Values {
  email: string;
  password: string;
}

export default function Login() {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const navigate = useNavigate();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const previousPage = searchParams.get('ref') ?? Pathname.Home;
  const { data } = useGetCurrentUser();

  useEffect((): void => {
    if (data) {
      navigate(previousPage, { replace: true });
    }
  }, [data, navigate, previousPage]);

  return (
    <Formik<Values>
      validationSchema={yup.object({
        email: yup.string().email('Enter a valid email.').required('Enter an email.'),
        password: yup.string().required('Enter a password.'),
      })}
      initialValues={{ email: '', password: '' }}
      validateOnChange={isSubmitted}
      onSubmit={async (values) => {
        try {
          const resp = await userAuth.signIn(values);
          if (resp.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
            const params = {
              email: values.email,
              session: resp.Session,
              name: resp.ChallengeParameters.USER_ID_FOR_SRP,
            };
            const resetSearchParams = new URLSearchParams(params);
            return navigate(
              {
                pathname: Pathname.PasswordReset,
                search: `?${resetSearchParams.toString()}`,
              },
              {
                replace: true,
              }
            );
          }
          navigate(previousPage, { replace: true });
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
                  Sign in
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
            <Container>
              <SpaceBetween size="l">
                <FormikFormField label="Email" name="email">
                  <FormikInput name="email" type="email" autoFocus autoComplete="email" />
                </FormikFormField>
                <FormikFormField label="Password" name="password">
                  <FormikInput name="password" type="password" autoComplete="current-password" />
                </FormikFormField>
              </SpaceBetween>
            </Container>
          </Form>
        </form>
      )}
    </Formik>
  );
}
