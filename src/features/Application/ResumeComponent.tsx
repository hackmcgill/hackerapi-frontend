import { Box } from '@rebass/grid';
import { FieldProps } from 'formik';
import * as React from 'react';
import ViewPDFComponent from '../../shared/Elements/ViewPDF';
import { FileUpload, Label, LabelText } from '../../shared/Form';
import { ManageApplicationModes } from './ManageApplicationForm';

export interface IResumeProps {
  label: string;
  mode: ManageApplicationModes;
  hackerId: string;
  value?: boolean;
  required?: boolean;
}
const ResumeComponent: React.FC<IResumeProps & FieldProps> = (props) => {
  const viewResume = <ViewPDFComponent {...props} />;
  return (
    <Flex mb={'32px'}>
      <Box>{props.mode === ManageApplicationModes.EDIT && viewResume}</Box>
      <Box ml={props.mode === ManageApplicationModes.EDIT ? '10px' : ''}>
        <Box mb={'8px'}>
          <Label>
            <LabelText label={props.label} required={props.required} />
          </Label>
        </Box>
        <FileUpload {...props} />
      </Box>
    </Flex>
  );
};
export { ResumeComponent };
export default ResumeComponent;
