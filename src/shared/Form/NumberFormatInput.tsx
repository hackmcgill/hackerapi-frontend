import * as React from 'react';
import { NumberFormatValues, PatternFormatProps } from 'react-number-format';
import { Label, LabelText, StyledNumericFormat, StyledPatternFormat } from '.';

interface ILabelledNumberFormatProp {
  value?: string;
  onValueChange: (value: NumberFormatValues) => void;
  label: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
}
export const NumberFormatInput: React.FunctionComponent<
  ILabelledNumberFormatProp & PatternFormatProps
> = (props) => {
  return (
    <Label>
      <LabelText label={props.label} required={props.required} />
        {props.format ? (
          <StyledPatternFormat {...props} />
        ) : (
          <StyledNumericFormat {...props} />
        )}
    </Label>
  );
};
