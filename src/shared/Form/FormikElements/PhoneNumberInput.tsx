import React from 'react';
import { FieldProps } from 'formik';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Label, LabelText } from '..';
import PhoneNumberContainer from './PhoneNumberContainer';
import { parsePhoneNumberFromString } from 'libphonenumber-js';


interface IPhoneNumberInputProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showOptionalLabel?: boolean;
}

const PhoneNumberInput: React.FC<IPhoneNumberInputProps & FieldProps> = ({
  field,
  form,
  label,
  placeholder,
  required,
  disabled,
  showOptionalLabel,
}) => {
    const handleChange = (value?: string) => {
        if (value) {
          const phoneNumber = parsePhoneNumberFromString(value);
          if (phoneNumber) {
            const countryCode = phoneNumber.countryCallingCode;
            const nationalNumber = phoneNumber.nationalNumber;
            const formattedValue = `+${countryCode}${nationalNumber}`;
            form.setFieldValue(field.name, formattedValue);
          } else {
            form.setFieldValue(field.name, value);
          }
        } else {
          form.setFieldValue(field.name, '');
        }
      };

  return (
    <PhoneNumberContainer>
        <Label>
            <LabelText
                label={label}
                required={required}
                showOptionalLabel={showOptionalLabel}
            />
            <PhoneInput className='phone-number-input'
                {...field}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                defaultCountry="CA"
                international={true}
                withCountryCallingCode={true}
            />
        </Label>
    </PhoneNumberContainer>
  );
};

export {PhoneNumberInput as PhoneNumberInput};