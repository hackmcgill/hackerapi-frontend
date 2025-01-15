import { FieldProps } from 'formik';
import * as React from 'react';
import { NumberFormatValues } from 'react-number-format';
import { NumberFormatInput } from '..';

interface INumberFormatFormikComponent {
  label: string;
  format: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
}

const NumberFormatFormikComponent: React.FunctionComponent<
  INumberFormatFormikComponent & FieldProps
> = (props) => {
  const placeholder = props.placeholder ? props.placeholder : '';

  return (
    <NumberFormatInput
      onValueChange={handleChange(props)}
      label={props.label}
      placeholder={placeholder}
      format={props.format}
      value={props.value}
      required={props.required}
      disabled={props.disabled}
    />
  );
};
/**
 * Function factory that generates function to handle changes in user's choice.
 * @param props The props passed into the Textarea component.
 * @returns the function that handles changes to the choices provided by the user.
 */
function handleChange({ field, form }: FieldProps) {
  return (value: NumberFormatValues) => {
    form.setFieldValue(field.name, value.value);
  };
}


export { NumberFormatFormikComponent as FormattedNumber };
