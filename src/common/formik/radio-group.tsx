import { forwardRef } from 'react';
import { useFormikContext } from 'formik';
import RadioGroup, { RadioGroupProps } from '@cloudscape-design/components/radio-group';

const FormikRadioGroup = forwardRef<RadioGroupProps.Ref, Props>(
  ({ name, onChange, ...props }, ref) => {
    const { values, setFieldValue } = useFormikContext<any>();

    return (
      <RadioGroup
        {...props}
        ref={ref}
        value={values[name]}
        onChange={(e) => {
          setFieldValue(name, e.detail.value);
          onChange?.(e);
        }}
      />
    );
  }
);

interface Props extends Omit<RadioGroupProps, 'value'> {
  name: string;
}

export default FormikRadioGroup;
