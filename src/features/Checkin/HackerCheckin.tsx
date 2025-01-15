import React from 'react';
import { Formik, Form, FastField, ErrorMessage } from 'formik';
import * as FormikElements from '../../shared/Form/FormikElements';
import { SubmitBtn } from '../../shared/Form';

const HackerCheckinForm: React.FC = () => {
  return (
    <Formik
      initialValues={{
        numberTeammates: 0,
        teamNames: ' ',
        challengesToSubmit: [],
        workshopsAttended: ' '
      }}
      onSubmit={(values) => {
        console.log('Submitting with:', values);
      }}
    >
      {(fp) => (
        <Form placeholder={fp.values}>
          <FastField
            name="numberTeammates"
            label="Number of team members (including yourself)"
            component={FormikElements.Input}
            required
            value={fp.values.numberTeammates}
          />
          <ErrorMessage component={FormikElements.Error} name="numberTeammates" />

          <FastField
            name="What are the names of your team members? Please include first and last names and use the names as written in your hacker application/registration. (ex.: John Doe, Jane Doe)"
            label="teamNames"
            component={FormikElements.Input}
            required
            value={fp.values.teamNames}
          />
          <ErrorMessage component={FormikElements.Error} name="teamNames" />

          <FastField
            name="challengesToSubmit"
            label="What challenges does your team plan to submit to? Note that all projects are entered into 'People's Choice' and 'Top 3 Hacks'. Choose up to 3 options only. "
            component={FormikElements.Input}
            required
            value={fp.values.challengesToSubmit}
          />
          <ErrorMessage component={FormikElements.Error} name="challengesToSubmit" />

          <FastField
            name="workshopsAttended"
            label="Did you attend a workshop/sponsor event? If so, which one(s)?"
            component={FormikElements.Input}
            required
            value={fp.values.workshopsAttended}
          />
          <ErrorMessage component={FormikElements.Error} name="workshopsAttended" />

          <SubmitBtn children="Submit"/>
        </Form>
      )}
    </Formik>
  );
};

export default HackerCheckinForm;
