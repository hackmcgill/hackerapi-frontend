import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AxiosResponse } from 'axios';
import {
  ErrorMessage,
  FastField,
  Field,
  Formik,
  FormikProps,
  FormikValues,
} from 'formik';
import { toast } from 'react-toastify';

import * as CONSTANTS from '../../config/constants';
import { H1, H2 } from '../../shared/Elements';
import GridTwoColumn from '../../shared/Elements/GridTwoColumn';
import { getOptionsFromEnum } from '../../util';
import PaginationHeader from './PaginationHeader/PaginationHeader';
import getValidationSchema from './validationSchema';

import {
  Countries,
  Degrees,
  FrontendRoute,
  HackerStatus,
  HackerReviewerStatus,
  IEthnicity,
  IHacker,
  ISetting,
  JobInterest,
  Majors,
  PreviousHackathons,
  ShirtSize,
  Skills,
} from '../../config';

import Button, { ButtonVariant } from '../../shared/Elements/Button';
import { Form } from '../../shared/Form';
import * as FormikElements from '../../shared/Form/FormikElements';

import { Account, APIResponse, Hacker, Settings } from '../../api';

import ValidationErrorGenerator from '../../shared/Form/validationErrorGenerator';

import ResumeComponent from './ResumeComponent';
import SchoolComponent from './SchoolComponent';

import WithToasterContainer from '../../shared/HOC/withToaster';
import theme from '../../shared/Styles/theme';

import books from '../../assets/images/books.svg';
import robotDrone from '../../assets/images/robotDrone.svg';

export enum ManageApplicationModes {
  CREATE,
  EDIT,
}

interface IManageApplicationProps {
  mode: ManageApplicationModes;
}

const ManageApplicationForm: React.FunctionComponent<
  IManageApplicationProps
> = (props) => {
  // Get access to router navigation in order to programatically change page
  const navigate = useNavigate();

  // Is hacker's application data still loading?
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Has this hacker already submitted an application
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Are we waiting for server to finish processing submission of application?
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Current page of the applciation that's visible
  const [pageNumber, setPageNumber] = useState<number>(1);

  // Hacker's resume
  const [resume, setResume] = useState<File | null>(null);

  // Hacker's application data
  const [hackerDetails, setHackerDetails] = useState<IHacker>({
    id: '',
    accountId: '',
    status: HackerStatus.HACKER_STATUS_NONE,
    reviewerStatus: HackerReviewerStatus.HACKER_REVIEWER_STATUS_NONE,
    application: {
      general: {
        school: '',
        degree: '',
        fieldOfStudy: [],
        graduationYear: NaN,
        jobInterest: '',
        URL: {
          resume: '',
          github: '',
          dribbble: '',
          linkedIn: '',
          personal: '',
          other: '',
        },
      },
      shortAnswer: {
        skills: [],
        question1: '',
        question2: '',
        comments: '',
        previousHackathons: NaN,
      },
      other: {
        ethnicity: [],
        sendEmail: false,
        country: '',
        privacyPolicy: false,
        codeOfConduct: false,
      },
      accommodation: {
        shirtSize: '',
        attendancePreference: 'In Person',
        impairments: '',
        barriers: '',
        travel: {
          amount: 0,
          reason: '',
        },
      },
    },
  });

  // Application settings
  const [settings, setSettings] = useState<ISetting>({
    openTime: new Date().toString(),
    closeTime: new Date().toString(),
    confirmTime: new Date().toString(),
    isRemote: false,
  });

  const getPreviousHackathonOptions = (options: any) => {
    return Object.keys(options).map((o) => ({
      label: o,
      value: options[o],
    }));
  };

  const convertNumberToOptionValue = (num: number) => {
    return isNaN(num) ? '' : num.toString();
  };

  // When this component mounts, fetch hacker's saved appliation data if it already exists
  useEffect(() => {
    (async () => {
      // Load settings
      try {
        const result = await Settings.get();
        const newSettings = result.data.data;
        setSettings(newSettings);
      } catch (e: any) {
        if (e && e.data) {
          ValidationErrorGenerator(e);
        }
      }

      // If hacker's application already exists, fetch it
      if (props.mode === ManageApplicationModes.EDIT) {
        try {
          const response = await Hacker.getSelf();
          setHackerDetails(response.data.data);
        } catch (e: any) {
          // If failed, probably because hacker hasn't created application before
          if (e && e.data) {
            ValidationErrorGenerator(e.data);
          }
        }
      }

      // Hacker data has been loaded, record that loading is finished
      setIsLoaded(true);
    })();
  }, [props.mode]);

  /**
   * Render the correct formik form based upon currently viewed application page
   * @param fp the formik props.
   */
  const renderFormik = (fp: FormikProps<any>) => {
    switch (fp.values.pageNumber) {
      case 2:
        return renderPortfolioFormik(fp);
      case 3:
        return renderShortAnswerFormik(fp);
      case 4:
        return renderAccommodationFormik(fp);
      case 5:
        return renderReimbursementFormik(fp);
      case 6:
        return renderReviewFormik(fp);
      default:
        return renderEducationFormik(fp);
    }
  };

  /**
   * Renders the education section of the application.
   * @param fp the formik props.
   */
  const renderEducationFormik = (fp: FormikProps<any>) => {
    return (
      <Form onKeyDown={onKeyDown} onSubmit={fp.handleSubmit}>
        <div className="container">
          <div className="fields">
            <H1 fontSize={'24px'} marginBottom={'40px'}>
              Education
            </H1>

            <FastField
              id="schoolName"
              name={'hacker.application.general.school'}
              component={SchoolComponent}
              value={fp.values.hacker.application.general.school}
              required={true}
              label={CONSTANTS.SCHOOL_LABEL}
              placeholder={CONSTANTS.SCHOOL_PLACEHOLDER}
            />
            <ErrorMessage
              component={FormikElements.Error}
              name="hacker.application.general.school"
            />
            <FastField
              name={'hacker.application.general.degree'}
              label={CONSTANTS.DEGREE_LABEL}
              placeholder={CONSTANTS.DEGREE_PLACEHOLDER}
              creatable={true}
              options={getOptionsFromEnum(Degrees)}
              component={FormikElements.Select}
              value={fp.values.hacker.application.general.degree}
              required={true}
            />
            <ErrorMessage
              component={FormikElements.Error}
              name="hacker.application.general.degree"
            />
            <FastField
              name={'hacker.application.general.graduationYear'}
              label={CONSTANTS.GRADUATION_YEAR_LABEL}
              placeholder="YYYY"
              format="####"
              component={FormikElements.FormattedNumber}
              value={fp.values.hacker.application.general.graduationYear}
              required={true}
            />
            <ErrorMessage
              component={FormikElements.Error}
              name="hacker.application.general.graduationYear"
            />
            <FastField
              name={'hacker.application.general.fieldOfStudy'}
              options={Majors}
              isMulti={true}
              creatable={false}
              component={FormikElements.Select}
              label={CONSTANTS.FIELD_OF_STUDY_LABEL}
              placeholder={CONSTANTS.FIELD_OF_STUDY_PLACEHOLDER}
              value={fp.values.hacker.application.general.fieldOfStudy}
              required={true}
            />
            <ErrorMessage
              component={FormikElements.Error}
              name="hacker.application.general.fieldOfStudy"
            />
          </div>

          <img src={books} alt="background" className="art" />
        </div>

        <div className="buttons">
          <Button
            type="reset"
            isLoading={false}
            disabled={true}
            variant={ButtonVariant.Secondary}
            isOutlined={true}
            style={{ display: 'none' }}
          >
            Back
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            variant={ButtonVariant.Secondary}
          >
            Next
          </Button>
        </div>

        <style jsx={true}>{`
          .container {
            max-width: 960px;
            margin: auto;

            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .fields {
            max-width: 440px;
            flex: 1;
          }

          .buttons {
            display: flex;
            justify-content: center;
            margin-top: 56px;
            margin-bottom: 80px;
          }

          .art {
            display: none;
          }

          @media (min-width: 992px) {
            .art {
              width: 481px;
              height: auto;

              position: relative;
              left: 97px;

              align-self: flex-start;
              top: 72px;
              display: initial;
            }
          }
        `}</style>
      </Form>
    );
  };

  /**
   * Renders the portfolio section of the application.
   * @param fp the formik props.
   */
  const renderPortfolioFormik = (fp: FormikProps<any>) => {
    return (
      <Form
        onKeyDown={onKeyDown}
        onSubmit={fp.handleSubmit}
        onReset={fp.handleReset}
      >
        <div className="container">
          <div className="fields">
            <H1 fontSize={'24px'} marginBottom={'40px'}>
              Portfolio
            </H1>

            <Field
              name="resume"
              component={ResumeComponent}
              label={CONSTANTS.RESUME_LABEL}
              mode={props.mode}
              hackerId={hackerDetails.id}
              required={props.mode === ManageApplicationModes.CREATE}
              value={fp.values.resume}
            />
            <ErrorMessage component={FormikElements.Error} name="resume" />

            <GridTwoColumn columnWidth="440px" rowGap="0" margin="0">
              <div>
                <FastField
                  name={'hacker.application.general.jobInterest'}
                  component={FormikElements.Select}
                  options={getOptionsFromEnum(JobInterest)}
                  label={CONSTANTS.JOBINTEREST_LABEL}
                  placeholder={CONSTANTS.JOBINTEREST_PLACEHOLDER}
                  value={fp.values.hacker.application.general.jobInterest}
                  required={true}
                />
                <ErrorMessage
                  component={FormikElements.Error}
                  name="hacker.application.general.jobInterest"
                />
              </div>

              <div>
                <FastField
                  name={'hacker.application.general.URL.github'}
                  inputType="url"
                  component={FormikElements.Input}
                  label={CONSTANTS.GITHUB_LINK_LABEL}
                  placeholder={CONSTANTS.GITHUB_LINK_PLACEHOLDER}
                  showOptionalLabel={true}
                />
                <ErrorMessage
                  component={FormikElements.Error}
                  name="hacker.application.general.URL.github"
                />
              </div>

              <div>
                <FastField
                  name={'hacker.application.general.URL.linkedIn'}
                  inputType="url"
                  component={FormikElements.Input}
                  label={CONSTANTS.LINKEDIN_LINK_LABEL}
                  placeholder={CONSTANTS.LINKEDIN_LINK_PLACEHOLDER}
                  value={fp.values.hacker.application.general.URL.linkedIn}
                  showOptionalLabel={true}
                />
                <ErrorMessage
                  component={FormikElements.Error}
                  name="hacker.application.general.URL.linkedIn"
                />
              </div>

              <div>
                <FastField
                  name={'hacker.application.general.URL.other'}
                  inputType="url"
                  component={FormikElements.Input}
                  label={CONSTANTS.OTHER_LINK_LABEL}
                  placeholder={CONSTANTS.OTHER_LINK_PLACEHOLDER}
                  value={fp.values.hacker.application.general.URL.other}
                  showOptionalLabel={true}
                />
                <ErrorMessage
                  component={FormikElements.Error}
                  name="hacker.application.general.URL.other"
                />
              </div>
            </GridTwoColumn>

            <div className="short-fields">
              <FastField
                name={'hacker.application.shortAnswer.skills'}
                isMulti={true}
                creatable={true}
                options={getOptionsFromEnum(Skills)}
                label={CONSTANTS.SKILLS_LABEL}
                placeholder={CONSTANTS.SKILLS_PLACEHOLDER}
                component={FormikElements.Select}
                value={fp.values.hacker.application.shortAnswer.skills}
                showOptionalLabel={true}
              />
            </div>

            <div className="short-fields">
              <H1 fontSize={'24px'} marginBottom={'40px'} marginTop={'60px'}>
                Personal Details
              </H1>

              <FastField
                name={'hacker.application.other.ethnicity'}
                isMulti={true}
                creatable={true}
                options={getOptionsFromEnum(IEthnicity)}
                label={CONSTANTS.ETHNICITY_LABEL}
                placeholder={CONSTANTS.ETHNICITY_PLACEHOLDER}
                component={FormikElements.Select}
                value={fp.values.hacker.application.other.ethnicity}
                required={true}
                text={CONSTANTS.ETHNICITY_TEXT}
              />
              <ErrorMessage
                component={FormikElements.Error}
                name="hacker.application.other.ethnicity"
              />

              <FastField
                name={'hacker.application.other.country'}
                options={Countries}
                isMulti={false}
                creatable={false}
                component={FormikElements.Select}
                label={CONSTANTS.COUNTRY_LABEL}
                placeholder={CONSTANTS.COUNTRY_PLACEHOLDER}
                value={fp.values.hacker.application.other.country}
                required={true}
              />
              <ErrorMessage
                component={FormikElements.Error}
                name="hacker.application.other.country"
              />
            </div>
          </div>
        </div>

        <div className="buttons">
          <Button
            type="reset"
            isLoading={false}
            disabled={isSubmitting}
            variant={ButtonVariant.Secondary}
            isOutlined={true}
            style={{ marginRight: '24px' }}
          >
            Back
          </Button>

          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            variant={ButtonVariant.Secondary}
          >
            Next
          </Button>
        </div>

        <style jsx={true}>{`
          .container {
            max-width: 960px;
            margin: auto;

            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .fields {
            max-width: 960px;
            flex: 1;
          }

          .short-fields {
            max-width: 440px;
          }

          .buttons {
            display: flex;
            justify-content: center;
            margin-top: 56px;
            margin-bottom: 80px;
          }
        `}</style>
      </Form>
    );
  };

  /**
   * Renders the short answer section of the application.
   * @param fp the formik props.
   */
  const renderShortAnswerFormik = (fp: FormikProps<any>) => {
    return (
      <Form
        onKeyDown={onKeyDown}
        onSubmit={fp.handleSubmit}
        onReset={fp.handleReset}
      >
        <div className="container">
          <div className="fields">
            <H1 fontSize={'24px'} marginBottom={'40px'}>
              Questions
            </H1>
            <FastField
              name={'hacker.application.shortAnswer.previousHackathons'}
              options={getPreviousHackathonOptions(PreviousHackathons)}
              label={CONSTANTS.PREVIOUS_HACKATHONS_LABEL}
              component={FormikElements.Select}
              value={convertNumberToOptionValue(
                fp.values.hacker.application.shortAnswer.previousHackathons
              )}
              required={true}
              style={{ maxWidth: '160px' }}
            />
            <ErrorMessage
              component={FormikElements.Error}
              name="hacker.application.shortAnswer.previousHackathons"
            />
            <FastField
              name={'hacker.application.shortAnswer.question1'}
              component={FormikElements.LongTextInput}
              label={CONSTANTS.QUESTION1_REQUEST_LABEL}
              value={fp.values.hacker.application.shortAnswer.question1}
              maxLength={2000}
              required={true}
              style={{ minHeight: '220px' }}
            />
            <ErrorMessage
              component={FormikElements.Error}
              name="hacker.application.shortAnswer.question1"
            />
            <FastField
              name={'hacker.application.shortAnswer.question2'}
              component={FormikElements.LongTextInput}
              label={CONSTANTS.QUESTION2_REQUEST_LABEL}
              value={fp.values.hacker.application.shortAnswer.question2}
              maxLength={2000}
              required={true}
              style={{ minHeight: '220px' }}
            />
            <ErrorMessage
              component={FormikElements.Error}
              name="hacker.application.shortAnswer.question2"
            />
            <FastField
              name={'hacker.application.shortAnswer.comments'}
              component={FormikElements.LongTextInput}
              label={CONSTANTS.COMMENTS_LABEL}
              value={fp.values.hacker.application.shortAnswer.comments}
              maxLength={500}
              required={false}
              style={{ minHeight: '88px' }}
            />
            <ErrorMessage
              component={FormikElements.Error}
              name="hacker.application.shortAnswer.comments"
            />
          </div>

          <img src={robotDrone} alt="background" className="art" />
        </div>

        <div className="buttons">
          <Button
            type="reset"
            isLoading={false}
            disabled={isSubmitting}
            variant={ButtonVariant.Secondary}
            isOutlined={true}
            style={{ marginRight: '24px' }}
          >
            Back
          </Button>

          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            variant={ButtonVariant.Secondary}
          >
            Next
          </Button>
        </div>

        <style jsx={true}>{`
          .container {
            max-width: 960px;
            margin: auto;

            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .fields {
            max-width: 600px;
            flex: 1;
          }

          .buttons {
            display: flex;
            justify-content: center;
            margin-top: 56px;
            margin-bottom: 80px;
          }

          .art {
            display: none;
          }

          @media (min-width: 1280px) {
            .art {
              height: 882px;
              width: auto;
              align-self: flex-end;

              position: relative;
              left: 128px;
              top: 52px;
              display: initial;
            }
          }
        `}</style>
      </Form>
    );
  };

  const renderReimbursementFormik = (fp: FormikProps<any>) => {
    return (
      <Form
        onKeyDown={onKeyDown}
        onSubmit={fp.handleSubmit}
        onReset={fp.handleReset}
      >
        <div className="container">
          <div className="fields">
            {/* <H1 fontSize={'24px'} marginBottom={'14px'}>
              Travel Reimbursement
            </H1>
            <div className="disclaimer">
              <p>
                We want to make McHacks accessible to as many hackers as
                possible. To this end, we are providing a limited amount of
                travel reimbursements and will prioritize giving funds to
                hackers in financial need.
              </p>
              <p>
                Requesting a reimbursement will not be used to influence your
                application decision. Once you receive your application
                decision, you will be provided with more details and terms
                regarding reimbursements. Please note that the amount you
                specify is not guaranteed.
              </p>
            </div>
            <div className="shorter-fields">
              <FastField
                name={'hacker.application.accommodation.travel.amount'}
                component={FormikElements.FormattedNumber}
                label={CONSTANTS.TRAVEL_REQUEST_AMOUNT_LABEL}
                placeholder={0}
                required={false}
                value={fp.values.hacker.application.accommodation.travel.amount}
              />
              <ErrorMessage
                component={FormikElements.Error}
                name={'hacker.application.accommodation.travel.amount'}
              />
              <FastField
                name={'hacker.application.accommodation.travel.reason'}
                value={fp.values.hacker.application.accommodation.travel.reason}
                component={FormikElements.LongTextInput}
                label={CONSTANTS.TRAVEL_REQUEST_REASON_LABEL}
                style={{ minHeight: '88px' }}
              />
              <ErrorMessage
                component={FormikElements.Error}
                name={'hacker.application.accommodation.travel.reason'}
              />
            </div> */}
            <H1 fontSize={'24px'} marginBottom={'40px'} marginTop={'60px'}>
              Terms and Conditions
            </H1>
            <FastField
              name={'hacker.application.other.codeOfConduct'}
              component={FormikElements.Checkbox}
              label={
                <span>
                  {CONSTANTS.COC_ACCEPTANCE_PHRASE}
                  {' McHacks '}
                  <a
                    href="https://mchacks.ca/code-of-conduct"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {CONSTANTS.MCHACKS_COC}
                  </a>
                  {' and '}
                  <a
                    href="https://mchacks.ca/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {CONSTANTS.MCHACKS_PRIVACY}
                  </a>
                </span>
              }
              value={fp.values.hacker.application.other.codeOfConduct}
              required={true}
            />
            <div className="checkbox-error-message">
              <ErrorMessage
                component={FormikElements.Error}
                name="hacker.application.other.codeOfConduct"
              />
            </div>
            <FastField
              name={'hacker.application.other.privacyPolicy'}
              component={FormikElements.Checkbox}
              label={CONSTANTS.MLH_LABEL}
              subtitle={
                <span>
                  {'I have read and agree to the '}
                  <a
                    href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {'MLH Code of Conduct'}
                  </a>
                  {'. '}
                  {
                    'I authorize you to share my application/registration information for event administration, ranking, MLH administration, pre- and post-event informational e-mails, and occasional messages about hackathons in-line with the '
                  }
                  <a
                    href="https://mlh.io/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {'MLH Privacy Policy'}
                  </a>
                  {'. I further agree to the terms of both the '}
                  <a
                    href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {'MLH Contest Terms and Conditions'}
                  </a>
                  {' and the '}
                  <a
                    href="https://mlh.io/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {'MLH Privacy Policy'}
                    {'.'}
                  </a>
                </span>
              }
              value={fp.values.hacker.application.other.privacyPolicy}
              required={true}
            />
            <div className="checkbox-error-message">
              <ErrorMessage
                component={FormikElements.Error}
                name="hacker.application.other.privacyPolicy"
              />
            </div>
            <FastField
              name={'hacker.application.other.sendEmail'} // change
              component={FormikElements.Checkbox}
              label={CONSTANTS.SEND_EMAIL_LABEL} // change
              value={fp.values.hacker.application.other.sendEmail} // change
            />
            <div className="checkbox-error-message">
              <ErrorMessage
                component={FormikElements.Error}
                name="hacker.application.other.sendEmail"
              />
            </div>
          </div>
        </div>

        <div className="buttons">
          <Button
            type="reset"
            isLoading={false}
            disabled={isSubmitting}
            variant={ButtonVariant.Secondary}
            isOutlined={true}
            style={{ marginRight: '24px' }}
          >
            Back
          </Button>

          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            variant={ButtonVariant.Secondary}
          >
            Next
          </Button>
        </div>

        <style jsx={true}>{`
          .container {
            max-width: 960px;
            margin: auto;

            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .disclaimer {
            font-size: 14px;
            color: ${theme.colors.black60};
            margin-bottom: 40px;
          }

          .fields {
            max-width: 600px;
            flex: 1;
          }

          .shorter-fields {
            max-width: 440px;
          }

          .checkbox-error-message {
            margin-top: 32px;
            margin-bottom: 32px;
            margin-left: 40px;
          }

          .buttons {
            display: flex;
            justify-content: center;
            margin-top: 56px;
            margin-bottom: 80px;
          }

          .art {
            height: 882px;
            width: auto;
            align-self: flex-end;

            position: relative;
            left: 128px;
            top: 52px;
          }
        `}</style>
      </Form>
    );
  };

  /**
   * Renders the accommodation section of the application.
   * @param fp the formik props.
   */
  const renderAccommodationFormik = (fp: FormikProps<any>) => {
    return (
      <Form
        onKeyDown={onKeyDown}
        onSubmit={fp.handleSubmit}
        onReset={fp.handleReset}
      >
        <div className="container">
          <div className="fields">
            <H1 fontSize={'24px'} marginBottom={'40px'}>
              Accommodation
            </H1>
            <div className="shorter-fields">
              <FastField
                name={'hacker.application.accommodation.shirtSize'}
                label={CONSTANTS.SHIRT_SIZE_LABEL}
                component={FormikElements.Select}
                options={getOptionsFromEnum(ShirtSize)}
                required={true}
                value={fp.values.hacker.application.accommodation.shirtSize}
              />
              <ErrorMessage
                name={'hacker.application.accommodation.shirtSize'}
                component={FormikElements.Error}
              />
            </div>

            <FastField
              name={'hacker.application.accommodation.impairments'}
              component={FormikElements.LongTextInput}
              label={CONSTANTS.IMPAIRMENTS_LABEL}
              value={fp.values.hacker.application.accommodation.impairments}
              required={false}
              style={{ minHeight: '88px' }}
              showOptionalLabel={true}
            />
            <ErrorMessage
              component={FormikElements.Error}
              name={'hacker.application.accommodation.impairments'}
            />
            <FastField
              name={'hacker.application.accommodation.barriers'}
              component={FormikElements.LongTextInput}
              label={CONSTANTS.BARRIERS_LABEL}
              value={fp.values.hacker.application.accommodation.barriers}
              required={false}
              style={{ minHeight: '88px' }}
              showOptionalLabel={true}
            />
            <ErrorMessage
              component={FormikElements.Error}
              name={'hacker.application.accommodation.barriers'}
            />
          </div>
        </div>

        <div className="buttons">
          <Button
            type="reset"
            isLoading={false}
            disabled={isSubmitting}
            variant={ButtonVariant.Secondary}
            isOutlined={true}
            style={{ marginRight: '24px' }}
          >
            Back
          </Button>

          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            variant={ButtonVariant.Secondary}
          >
            Next
          </Button>
        </div>

        <style jsx={true}>{`
          .container {
            max-width: 960px;
            margin: auto;

            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .fields {
            max-width: 600px;
            flex: 1;
          }

          .shorter-fields {
            max-width: 440px;
          }

          .checkbox-error-message {
            margin-top: 32px;
            margin-bottom: 32px;
            margin-left: 40px;
          }

          .buttons {
            display: flex;
            justify-content: center;
            margin-top: 56px;
            margin-bottom: 80px;
          }

          .art {
            height: 882px;
            width: auto;
            align-self: flex-end;

            position: relative;
            left: 128px;
            top: 52px;
          }
        `}</style>
      </Form>
    );
  };

  /**
   * Renders the review section of the application
   * @param fp the formik props.
   */
  const renderReviewFormik = (fp: FormikProps<any>) => {
    return (
      <Form
        onKeyDown={onKeyDown}
        onSubmit={fp.handleSubmit}
        onReset={fp.handleReset}
      >
        <div className="container">
          <H1 marginBottom="16px">Review</H1>
          <div className="info-text">
            {CONSTANTS.REVIEW_APPLICIATION_DESCRIPTION}
          </div>

          <H2 marginLeft="0px" marginTop="36px" marginBottom="24px">
            Education
          </H2>
          <GridTwoColumn rowGap="0" margin="0">
            <div className="field">
              <div className="name">{CONSTANTS.SCHOOL_LABEL}</div>
              <div className="value">
                {hackerDetails.application.general.school}
              </div>
            </div>
            <div className="field">
              <div className="name">{CONSTANTS.DEGREE_LABEL}</div>
              <div className="value">
                {hackerDetails.application.general.degree}
              </div>
            </div>
            <div className="field">
              <div className="name">{CONSTANTS.FIELD_OF_STUDY_LABEL}</div>
              <div className="value">
                {hackerDetails.application.general.fieldOfStudy}
              </div>
            </div>
            <div className="field">
              <div className="name">{CONSTANTS.GRADUATION_YEAR_LABEL}</div>
              <div className="value">
                {hackerDetails.application.general.graduationYear}
              </div>
            </div>
          </GridTwoColumn>

          <H2 marginLeft="0px" marginTop="36px" marginBottom="24px">
            Portfolio
          </H2>
          <GridTwoColumn rowGap="0" margin="0">
            <div className="field">
              <div className="name">{CONSTANTS.RESUME_LABEL}</div>
              <div className="value">{resume && resume.name}</div>
            </div>
            <div className="field">
              <div className="name">{CONSTANTS.LINKEDIN_LINK_LABEL}</div>
              <div className="value">
                {hackerDetails.application.general.URL.linkedIn || 'N/A'}
              </div>
            </div>
            <div className="field">
              <div className="name">{CONSTANTS.GITHUB_LINK_LABEL}</div>
              <div className="value">
                {hackerDetails.application.general.URL.github || 'N/A'}
              </div>
            </div>
            <div className="field">
              <div className="name">{CONSTANTS.OTHER_LINK_LABEL}</div>
              <div className="value">
                {hackerDetails.application.general.URL.other || 'N/A'}
              </div>
            </div>
            <div className="field">
              <div className="name">{CONSTANTS.JOBINTEREST_LABEL}</div>
              <div className="value">
                {hackerDetails.application.general.jobInterest || 'N/A'}
              </div>
            </div>
          </GridTwoColumn>

          <H2 marginLeft="0px" marginTop="36px" marginBottom="24px">
            Personal Details
          </H2>
          <GridTwoColumn rowGap="0" margin="0">
            <div className="field">
              <div className="name">{CONSTANTS.ETHNICITY_LABEL}</div>
              <div className="value">
                {hackerDetails.application.other.ethnicity}
              </div>
            </div>
            <div className="field">
              <div className="name">{CONSTANTS.COUNTRY_LABEL}</div>
              <div className="value">
                {hackerDetails.application.other.country}
              </div>
            </div>
          </GridTwoColumn>

          <H2 marginLeft="0px" marginTop="36px" marginBottom="24px">
            Questions
          </H2>
          <div className="field">
            <div className="name">{CONSTANTS.PREVIOUS_HACKATHONS_LABEL}</div>
            <div className="value">
              {hackerDetails.application.shortAnswer.previousHackathons}
            </div>
          </div>
          <div className="field">
            <div className="name">{CONSTANTS.QUESTION1_REQUEST_LABEL}</div>
            <div className="value">
              {hackerDetails.application.shortAnswer.question1}
            </div>
          </div>
          <div className="field">
            <div className="name">{CONSTANTS.QUESTION2_REQUEST_LABEL}</div>
            <div className="value">
              {hackerDetails.application.shortAnswer.question2}
            </div>
          </div>
          <div className="field">
            <div className="name">{CONSTANTS.COMMENTS_LABEL}</div>
            <div className="value">
              {hackerDetails.application.shortAnswer.comments || 'N/A'}
            </div>
          </div>

          <H2 marginLeft="0px" marginTop="36px" marginBottom="24px">
            Accommodation
          </H2>
          <GridTwoColumn rowGap="0" margin="0">
            {!settings.isRemote && (
              <div className="field">
                <div className="name">{CONSTANTS.SHIRT_SIZE_LABEL}</div>
                <div className="value">
                  {hackerDetails.application.accommodation.shirtSize}
                </div>
              </div>
            )}
            <div className="field">
              <div className="name">{CONSTANTS.IMPAIRMENTS_LABEL}</div>
              <div className="value">
                {hackerDetails.application.accommodation.impairments || 'N/A'}
              </div>
            </div>
            <div className="field">
              <div className="name">{CONSTANTS.BARRIERS_LABEL}</div>
              <div className="value">
                {hackerDetails.application.accommodation.barriers || 'N/A'}
              </div>
            </div>
          </GridTwoColumn>

          {hackerDetails.application.accommodation.travel.amount > 0 ? (
            <>
              <H2 marginLeft="0px" marginTop="36px" marginBottom="24px">
                Travel Reimbursement
              </H2>
              <GridTwoColumn rowGap="0" margin="0">
                <div className="field">
                  <div className="name">
                    {CONSTANTS.TRAVEL_REQUEST_AMOUNT_LABEL}
                  </div>
                  <div className="value">
                    {hackerDetails.application.accommodation.travel.amount}
                  </div>
                </div>
                <div className="field">
                  <div className="name">
                    {CONSTANTS.TRAVEL_REQUEST_REASON_LABEL}
                  </div>
                  <div className="value">
                    {hackerDetails.application.accommodation.travel.reason ||
                      'N/A'}
                  </div>
                </div>
              </GridTwoColumn>
            </>
          ) : null}
        </div>

        <div className="buttons">
          <Button
            type="reset"
            isLoading={false}
            disabled={isSubmitting}
            variant={ButtonVariant.Secondary}
            isOutlined={true}
            style={{ marginRight: '24px' }}
          >
            Back
          </Button>

          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            variant={ButtonVariant.Primary}
          >
            {props.mode === ManageApplicationModes.CREATE ? 'Submit' : 'Update'}
          </Button>
        </div>

        <style jsx={true}>{`
          .container {
            max-width: 960px;
            margin: auto;
          }

          .info-text {
            color: ${theme.colors.black80};
            font-family: ${theme.fonts.header};
            font-size: 16px;
            margin-bottom: 4px;
          }

          .field {
            margin-bottom: 24px;
          }

          .field .name {
            font-size: 16px;
            font-family: ${theme.fonts.header};
            color: ${theme.colors.black80};
            margin-bottom: 8px;
            font-weight: bold;
          }

          .field .value {
            font-size: 16px;
            font-family: ${theme.fonts.header};
            color: ${theme.colors.purple};
            overflow-wrap: break-word;
          }

          .buttons {
            display: flex;
            justify-content: center;
            margin-top: 56px;
            margin-bottom: 80px;
          }

          .eventPrompt {
            background: ${theme.colors.purpleLight};
            font-family: ${theme.fonts.header};
            font-size: 20px;
            text-align: center;
            padding: 20px;
            border-radius: 8px;
            margin-top: 46px;
          }
        `}</style>
      </Form>
    );
  };

  /**
   * This converts the formik values object into the IHacker object.
   * @param values Formik values
   * @param resumeLink the link to the resume. Used only when the hacker is updating their application.
   * @param hackerId the hacker id. Used only when the hacker is updating their application.
   * @param accountId the account id associated with this hacker.
   */
  function convertFormikToHacker(
    values: FormikValues,
    accountId: string = '',
    hackerId: string = ''
  ): IHacker {
    values.hacker.application.shortAnswer.previousHackathons = parseInt(
      values.hacker.application.shortAnswer.previousHackathons,
      10
    );

    const hacker: IHacker = {
      id: hackerId,
      accountId,
      status: HackerStatus.HACKER_STATUS_NONE,
      reviewerStatus: HackerReviewerStatus.HACKER_REVIEWER_STATUS_NONE,
      application: values.hacker.application,
    };

    if (settings.isRemote) {
      hacker.application.accommodation.travel = {
        amount: 0,
        reason: '',
      };
    }

    return hacker;
  }

  /**
   * Stop enter submitting the form.
   * @param keyEvent Event triggered when the user presses a key.
   */
  const onKeyDown = (keyEvent: any) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  };

  /**
   * Event handler to go the previous section of the application, while also saving values on the current section.
   * @param values The formik values
   */
  const previousPage = (values: any) => {
    let app;
    if (values.hacker.id && values.hacker.accountId) {
      app = convertFormikToHacker(
        values,
        values.hacker.accountId,
        values.hacker.id
      );
    } else if (values.hacker.accountId) {
      app = convertFormikToHacker(values, values.hacker.accountId);
    } else {
      app = convertFormikToHacker(values);
    }

    setPageNumber(values.pageNumber - 1);
    setHackerDetails(app);

    if (resume !== values.resume && values.resume) {
      setResume(values.resume);
    } else {
      setResume(resume || values.resume);
    }

    // Reset scroll to top of page
    window.scrollTo(0, 0);
  };

  /**
   * Event handler to go the next section of the application, while also saving values on the current section.
   * @param values The formik values
   */
  const nextPage = (values: any) => {
    let app;
    if (values.hacker.id && values.hacker.accountId) {
      app = convertFormikToHacker(
        values,
        values.hacker.accountId,
        values.hacker.id
      );
    } else if (values.hacker.accountId) {
      app = convertFormikToHacker(values, values.hacker.accountId);
    } else {
      app = convertFormikToHacker(values);
    }
    setPageNumber(values.pageNumber + 1);
    setHackerDetails(app);

    if (resume !== values.resume && values.resume) {
      setResume(values.resume);
    } else {
      setResume(resume || values.resume);
    }
    // Reset scroll to top of page
    window.scrollTo(0, 0);
  };

  /**
   * Function called when formik form is submitted.
   * @param values the formik values
   * @param actions the formik actions
   */
  const handleSubmit = (values: any) => {
    if (values.pageNumber !== CONSTANTS.TOTAL_PAGES) {
      nextPage(values);
    } else {
      setIsSubmitting(true);
      const handler =
        props.mode === ManageApplicationModes.EDIT ? handleEdit : handleCreate;
      handler(values)
        .then((success: boolean) => {
          if (success) {
            console.log('Submitted application');
            toast.success(
              `Account ${
                props.mode === ManageApplicationModes.EDIT
                  ? 'edited'!
                  : 'created!'
              }`
            );
            setIsSubmitted(true);
            navigate(FrontendRoute.HOME_PAGE);
          } else {
            setIsSubmitting(false);
            toast.error(`There was an error when submitting the application.`);
          }
        })
        .catch((response: AxiosResponse<APIResponse<any>> | undefined) => {
          setIsSubmitting(false);
          if (response) {
            ValidationErrorGenerator(response.data);
          }
        });
    }
  };

  /**
   * Handles the creation of the application.
   * @param values the formik values
   * @param actions the formik actions
   */
  const handleCreate = async (values: any): Promise<boolean> => {
    const acctResponse = await Account.getSelf();

    if (acctResponse.status !== 200) {
      console.error('Error while getting current user');
      return false;
    }
    const account = acctResponse.data.data;
    const application = convertFormikToHacker(values, account.id);
    const hackerResponse = await Hacker.create(application);
    if (hackerResponse.status !== 200) {
      console.error('Error while creating application');
      return false;
    }
    const hacker = hackerResponse.data.data;
    const resumeResponse = await Hacker.uploadResume(hacker.id, values.resume);
    if (resumeResponse.status !== 200) {
      console.error('Could not upload resume properly');
      return false;
    } else {
      console.log('Uploaded application properly!');
    }
    return true;
  };

  /**
   * Handles the editing of the application.
   * @param values Formik values
   * @param actions Formik actions
   */
  const handleEdit = async (values: any): Promise<boolean> => {
    const acctResponse = await Account.getSelf();

    if (acctResponse.status !== 200) {
      console.error('Error while getting current user');
      return false;
    }

    const account = acctResponse.data.data;
    const hackerId = hackerDetails.id;
    // convert the formik values to the application object.
    const application = convertFormikToHacker(values, account.id, hackerId);
    const hackerResponse = await Hacker.update(application);

    if (hackerResponse.status !== 200) {
      console.error('Error while updating application');
      return false;
    }
    if (values.resume) {
      // only upload a resume if they have added a resume to the form.
      const resumeResponse = await Hacker.uploadResume(hackerId, values.resume);

      if (resumeResponse.status !== 200) {
        console.error('Could not upload resume properly');
        return false;
      } else {
        console.log('Uploaded application properly!');
      }
    }
    return true;
  };

  // If application creation deadline has passed, return user to the home page
  if (
    isLoaded &&
    new Date() > new Date(settings.closeTime) &&
    props.mode === ManageApplicationModes.CREATE
  ) {
    navigate(FrontendRoute.HOME_PAGE);
  }

  // If application is loaded, then render it
  return isLoaded ? (
    <div style={{ padding: '0 25px' }}>
      <PaginationHeader
        pageNumber={pageNumber}
        totalPages={CONSTANTS.TOTAL_PAGES}
        lastCompletedPage={pageNumber}
      />
      <Formik
        enableReinitialize={true}
        initialValues={{
          hacker: hackerDetails,
          resume: resume || undefined,
          pageNumber,
        }}
        onSubmit={handleSubmit}
        onReset={previousPage}
        validationSchema={getValidationSchema(
          props.mode === ManageApplicationModes.CREATE,
          pageNumber
        )}
      >
        {renderFormik}
      </Formik>
    </div>
  ) : null;
};

export default WithToasterContainer(ManageApplicationForm);
