import { forwardRef } from 'react';
import { useFormikContext } from 'formik';
import CloudscapeInput, { InputProps } from '@cloudscape-design/components/input';

const FormikInput = forwardRef<InputProps.Ref, Props>(
  ({ name, onChange, onBlur, ...props }, ref) => {
    const { values, setFieldValue, setFieldTouched } = useFormikContext<any>();
    return (
      <CloudscapeInput
        {...props}
        ref={ref}
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
);

interface Props extends Omit<InputProps, 'value'> {
  name: string;
}

export default FormikInput;
