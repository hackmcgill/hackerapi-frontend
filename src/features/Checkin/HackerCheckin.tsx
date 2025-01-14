import React from 'react';
import { Formik, Form, FastField, ErrorMessage } from 'formik';
import * as FormikElements from '../../shared/Form/FormikElements';

const HackerCheckinForm: React.FC = () => {
  return (
    <Formik
      initialValues={{
        placeholderFirstName: '',
        placeholderLastName: '',
        placeholderEmail: '',
        placeholderPassword: '',
        placeholderPhoneNumber: '',
        placeholderGender: '',
        placeholderPronoun: '',
        placeholderDietaryRestrictions: [],
      }}
      onSubmit={(values) => {
        console.log('Submitting with:', values);
      }}
    >
      {(fp) => (
        <Form placeholder={fp.values}>
          <FastField
            name="placeholderFirstName"
            label="Placeholder First Name"
            component={FormikElements.Input}
            required
            value={fp.values.placeholderFirstName}
          />
          <ErrorMessage component={FormikElements.Error} name="placeholderFirstName" />

          <FastField
            name="placeholderLastName"
            label="Placeholder Last Name"
            component={FormikElements.Input}
            required
            value={fp.values.placeholderLastName}
          />
          <ErrorMessage component={FormikElements.Error} name="placeholderLastName" />

          <FastField
            name="placeholderEmail"
            label="Placeholder Email"
            component={FormikElements.Input}
            required
            value={fp.values.placeholderEmail}
          />
          <ErrorMessage component={FormikElements.Error} name="placeholderEmail" />

          <FastField
            name="placeholderPassword"
            label="Placeholder Password"
            inputType={'password'}
            component={FormikElements.Input}
            required
            value={fp.values.placeholderPassword}
          />
          <ErrorMessage component={FormikElements.Error} name="placeholderPassword" />

          <FastField
            name="placeholderPhoneNumber"
            label="Placeholder Phone Number"
            component={FormikElements.PhoneNumberInput}
            required
            value={fp.values.placeholderPhoneNumber}
          />
          <ErrorMessage component={FormikElements.Error} name="placeholderPhoneNumber" />

          <FastField
            name="placeholderGender"
            label="Placeholder Gender"
            component={FormikElements.Select}
            options={[]}
            required
            value={fp.values.placeholderGender}
          />
          <ErrorMessage component={FormikElements.Error} name="placeholderGender" />

          <FastField
            name="placeholderPronoun"
            label="Placeholder Pronoun"
            component={FormikElements.Select}
            options={[]}
            required
            value={fp.values.placeholderPronoun}
          />
          <ErrorMessage component={FormikElements.Error} name="placeholderPronoun" />

          <FastField
            name="placeholderDietaryRestrictions"
            label="Placeholder Dietary Restrictions"
            component={FormikElements.Select}
            isMulti
            options={[]}
            required
            value={fp.values.placeholderDietaryRestrictions}
          />
          <ErrorMessage
            component={FormikElements.Error}
            name="placeholderDietaryRestrictions"
          />

          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default HackerCheckinForm;
