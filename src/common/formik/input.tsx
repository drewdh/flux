import { useFormikContext } from 'formik';
import CloudscapeInput, { InputProps } from '@cloudscape-design/components/input';

export default function FormikInput({ name, onChange, ...props }: Props) {
  const { values, setFieldValue } = useFormikContext<any>();
  return (
    <CloudscapeInput
      {...props}
      value={values[name]}
      onChange={(e) => {
        setFieldValue(name, e.detail.value);
        onChange?.(e);
      }}
    />
  );
}

interface Props extends Omit<InputProps, 'value'> {
  name: string;
}
