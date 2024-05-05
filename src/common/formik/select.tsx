import { forwardRef } from 'react';
import { useFormikContext } from 'formik';
import Select, { SelectProps } from '@cloudscape-design/components/select';

const FormikSelect = forwardRef<SelectProps.Ref, Props>(
  ({ name, onChange, onBlur, ...props }, ref) => {
    const { values, setFieldValue, setFieldTouched } = useFormikContext<any>();

    return (
      <Select
        {...props}
        ref={ref}
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
);

interface Props extends Omit<SelectProps, 'selectedOption'> {
  name: string;
}

export default FormikSelect;
