import { Ref } from 'react';
import { useFormikContext } from 'formik';
import CloudscapeInput, { InputProps } from '@cloudscape-design/components/input';

export default function FormikInput({ name, onChange, onBlur, ...props }: Props) {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<any>();
  return (
    <CloudscapeInput
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

interface Props extends Omit<InputProps, 'value'> {
  name: string;
  ref?: Ref<InputProps.Ref>;
}
