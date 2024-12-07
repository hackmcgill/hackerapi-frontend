import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';

import { Box, Flex } from '@rebass/grid';
import { toast } from 'react-toastify';

import { Hacker } from '../../api';
import {
  HACKATHON_NAME,
  HackerStatus,
  IAccount,
  IHacker,
  UserType,
} from '../../config';
import {
  Button,
  ButtonVariant,
  H1,
  H2,
  MaxWidthBox,
} from '../../shared/Elements';
import ViewPDFComponent from '../../shared/Elements/ViewPDF';
import { Form, StyledSelect } from '../../shared/Form';
import ValidationErrorGenerator from '../../shared/Form/validationErrorGenerator';
import theme from '../../shared/Styles/theme';

//date2age is currently unused
import { date2age, getOptionsFromEnum } from '../../util';

import SHField from './SingleHackerField';
import SHLink from './SingleHackerLink';
import SHParagraph from './SingleHackerParagraph';
import SingleHackerSection from './SingleHackerSection';

interface IHackerViewProps {
  hacker: IHacker;
  userType: UserType;
}

const SingleHackerView: React.FC<IHackerViewProps> = (props) => {
  const [status, setStatus] = useState(props.hacker.status);
  const [isAdmin, setIsAdmin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsAdmin(props.userType === UserType.STAFF);
  }, [props.userType]);

  useEffect(() => {
    setStatus(props.hacker.status);
  }, [props]);

  const submit = async () => {
    try {
      const { hacker } = props;
      setIsLoading(true);
      await Hacker.updateStatus(hacker.id, status);
      setIsLoading(false);
      toast.success(`Hacker status updated to ${status}!`);
    } catch (e: any) {
      if (e && e.data) {
        ValidationErrorGenerator(e.data);
      }
    }
  };

  const handleChange = ({ value }: any) => {
    setStatus(value);
  };

  const { hacker } = props;
  const account = (hacker.accountId as IAccount) || {};
  const pronoun = account.pronoun ? `(${account.pronoun})` : '';

  // convert birthdates to ages if age value doesn't exist and birthdate value does
  if (account.birthDate && !account.age) {
    account.age = date2age(account.birthDate);
  }

  return (
    <article>
      <Helmet>
        <title>
          {`${account.firstName} ${account.lastName}`} | {HACKATHON_NAME}
        </title>
      </Helmet>
      <MaxWidthBox maxWidth="800px">
        <Flex flexDirection={'column'} style={{ marginTop: '4em' }}>
          <H1 marginLeft="0">
            {`${account.firstName} ${account.lastName} ${pronoun}`}
          </H1>
        </Flex>
        <hr hidden={isAdmin} />
        <Box ml="6px">
          <SingleHackerSection
            title={'Administrative Information'}
            hidden={!isAdmin}
          >
            <Form>
              <Flex
                width="100%"
                flexWrap="wrap"
                justifyContent="start"
                alignItems="center"
                mb="16px"
              >
                <Box width={[1, 1 / 2]} style={{ paddingTop: '10px' }}>
                  <StyledSelect
                    isTight={true}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    options={getOptionsFromEnum(HackerStatus)}
                    isDisabled={!isAdmin}
                    onChange={handleChange}
                    value={{
                      label: status,
                      value: status,
                    }}
                  />
                </Box>
                <Flex
                  justifyContent={['center', 'flex-start']}
                  alignItems="center"
                  ml="16px"
                >
                  <Button
                    type="button"
                    onClick={submit}
                    variant={ButtonVariant.Primary}
                    isLoading={isLoading}
                    disabled={isLoading || !isAdmin}
                  >
                    Change status
                  </Button>
                </Flex>
              </Flex>
            </Form>
            <Flex
              width="100%"
              flexWrap="wrap"
              justifyContent="space-between"
              alignItems="center"
            >
              <SHField label="Age" text={account.age} />
              <SHField
                label="Shirt Size"
                text={hacker.application.accommodation.shirtSize}
              />
              {/* Removed as shirt size is no longer a property of account
                <SHField label="Shirt Size" text={account.shirtSize} /> */}
              <SHField label="Gender" text={account.gender} />
              <SHLink
                label="Phone Number"
                link={`tel:${account.phoneNumber}`}
                linkText={account.phoneNumber}
              />
              <SHField
                label="Dietary Restrictions"
                text={
                  account.dietaryRestrictions &&
                  account.dietaryRestrictions.join(', ')
                }
              />
              <SHParagraph
                label="Impairments"
                text={hacker.application.accommodation.impairments}
              />
              <SHParagraph
                label="Barriers"
                text={hacker.application.accommodation.barriers}
              />
            </Flex>
            <hr />
          </SingleHackerSection>
          <H2 color={theme.colors.black60}>Basic Information</H2>
          <Flex
            width="100%"
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
          >
            <SHField label="Email" text={account.email} />
            <SHField label="School" text={hacker.application.general.school} />
            <SHField label="Degree" text={hacker.application.general.degree} />
            <SHField label="Status" text={hacker.status} />
            <SHField
              label="Graduation Year"
              text={hacker.application.general.graduationYear}
            />
            <SHField
              label="Field(s) of Study"
              text={hacker.application.general.fieldOfStudy.join(', ')}
            />
            <SHField
              label="Skills"
              text={
                hacker.application.shortAnswer.skills &&
                hacker.application.shortAnswer.skills.join(', ')
              }
            />
            <SHField
              label="Job interest"
              text={hacker.application.general.jobInterest}
            />
          </Flex>
          <hr />
          <H2 color={theme.colors.black60}>Links</H2>
          <Flex
            width="100%"
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
          >
            <SHLink
              label="GitHub"
              link={hacker.application.general.URL.github}
            />
            <SHLink
              label="LinkedIn"
              link={hacker.application.general.URL.linkedIn}
            />
            <SHLink
              label="Website"
              link={hacker.application.general.URL.other}
            />
            <SHLink
              label="Dribbble"
              link={hacker.application.general.URL.dribbble}
            />
          </Flex>
          {/* Only tier1 sponsors and admin have access to user resumes */}
          {props.userType === UserType.SPONSOR_T1 ||
          props.userType === UserType.STAFF ? (
            <Flex flexDirection={'column'} style={{ marginTop: '4em' }}>
              <ViewPDFComponent hackerId={hacker.id} />
            </Flex>
          ) : null}
          <SingleHackerSection title="Additional Information" hidden={!isAdmin}>
            <SHParagraph
              label="Why McHacks?"
              text={hacker.application.shortAnswer.question1}
            />
            <SHParagraph
              label="What are you passionate about?"
              text={hacker.application.shortAnswer.question2}
            />
            <SHParagraph
              label="Comments"
              text={hacker.application.shortAnswer.comments}
            />
          </SingleHackerSection>
        </Box>
      </MaxWidthBox>
    </article>
  );
};

export default SingleHackerView;
