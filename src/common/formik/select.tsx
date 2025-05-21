import { Ref } from 'react';
import { useFormikContext } from 'formik';
import Select, { SelectProps } from '@cloudscape-design/components/select';

export default function FormikSelect({ name, onChange, onBlur, ...props }: Props) {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<any>();

  return (
    <Select
      {...props}
      selectedOption={values[name]}
      onChange={(e) => {
        setFieldValue(name, e.detail.selectedOption);
        onChange?.(e);
      }}
      onBlur={(e) => {
        setFieldTouched(name);
        onBlur?.(e);
      }}
    />
  );
}

interface Props extends Omit<SelectProps, 'selectedOption'> {
  name: string;
  ref?: Ref<SelectProps.Ref>;
}
