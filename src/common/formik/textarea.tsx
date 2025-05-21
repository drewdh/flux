import { Ref } from 'react';
import { useFormikContext } from 'formik';
import Textarea, { TextareaProps } from '@cloudscape-design/components/textarea';

export default function FormikTextArea({ name, onChange, onBlur, ...props }: Props) {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<any>();
  return (
    <Textarea
      {...props}
      value={values[name]}
      onChange={(e) => {
        setFieldValue(name, e.detail.value);
        onChange?.(e);
      }}
      onBlur={(e) => {
        setFieldTouched(name);
        onBlur?.(e);
      }}
    />
  );
}

interface Props extends Omit<TextareaProps, 'value'> {
  name: string;
  ref?: Ref<TextareaProps.Ref>;
}
