import { forwardRef } from 'react';
import { useFormikContext } from 'formik';
import Textarea, { TextareaProps } from '@cloudscape-design/components/textarea';

const FormikTextArea = forwardRef<TextareaProps.Ref, Props>(
  ({ name, onChange, onBlur, ...props }, ref) => {
    const { values, setFieldValue, setFieldTouched } = useFormikContext<any>();
    return (
      <Textarea
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

interface Props extends Omit<TextareaProps, 'value'> {
  name: string;
}

export default FormikTextArea;
