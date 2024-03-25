import FormField, { FormFieldProps } from '@cloudscape-design/components/form-field';
import { useFormikContext } from 'formik';

export default function FormikFormField({ name, ...props }: Props) {
  const { errors } = useFormikContext<any>();

  return <FormField {...props} errorText={errors[name] as string} />;
}

interface Props extends Omit<FormFieldProps, 'errorText'> {
  name: string;
}
