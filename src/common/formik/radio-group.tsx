import { Ref } from 'react';
import { useFormikContext } from 'formik';
import RadioGroup, { RadioGroupProps } from '@cloudscape-design/components/radio-group';

export default function FormikRadioGroup({ name, onChange, ...props }: Props) {
  const { values, setFieldValue } = useFormikContext<any>();

  return (
    <RadioGroup
      {...props}
      value={values[name]}
      onChange={(e) => {
        setFieldValue(name, e.detail.value);
        onChange?.(e);
      }}
    />
  );
}

interface Props extends Omit<RadioGroupProps, 'value'> {
  name: string;
  ref?: Ref<RadioGroupProps.Ref>;
}
