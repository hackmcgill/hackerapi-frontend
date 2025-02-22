import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { Input } from '../../shared/Form';

import { Box, Flex } from '@rebass/grid';
import { toast } from 'react-toastify';

import { Hacker } from '../../api';
import {
  HACKATHON_NAME,
  HackerStatus,
  HackerReviewerStatus,
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
  const [reviewerStatus, setReviewerStatus] = useState(props.hacker.reviewerStatus);
  const [reviewerStatus2, setReviewerStatus2] = useState('None');
  const [isAdmin, setIsAdmin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsAdmin(props.userType === UserType.STAFF);
  }, [props.userType]);

  useEffect(() => {
    setStatus(props.hacker.status);
  }, [props]);

  useEffect(() => {
    setReviewerStatus(props.hacker.reviewerStatus);
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

  // const submitReviewer = async () => {
  //   try {
  //     const { hacker } = props;
  //     // setIsLoading(true);
  //     await Hacker.updateReviewerStatus(hacker.id, reviewerStatus);
  //     // setIsLoading(false);
  //     toast.success(`Hacker status updated to ${reviewerStatus}!`);
  //   } catch (e: any) {
  //     if (e && e.data) {
  //       ValidationErrorGenerator(e.data);
  //     }
  //   }
  // };

  const handleChange = ({ value }: any) => {
    setStatus(value);
  };

  const handleRChange = ({value}:any) => {
    setReviewerStatus2(value);
  }

  const handleReviewerChange = async ({ value }: any) => {
    try {
      console.log('VALUE', value);
      setReviewerStatus(value);
      console.log(value);
      console.log(reviewerStatus);
      console.log(props.hacker.reviewerStatus);
      console.log("ho");
      await submitReviewer(); 
    } catch (error) {
      console.error('Error updating reviewer status:', error);
    }
  };

  const submitReviewer = async () => {
    try {
      const { hacker } = props;
      // const updatedReviewerStatus = reviewerStatusOverride || reviewerStatus;
      console.log('REVIEW', reviewerStatus);
      await Hacker.updateReviewerStatus(hacker.id, reviewerStatus);
      console.log(reviewerStatus);
      // toast.success(`Hacker status updated to ${reviewerStatus}!`);
    } catch (e: any) {
      if (e?.data) {
        ValidationErrorGenerator(e.data);
      } else {
        console.error('Unexpected error:', e);
      }
    }
  };

  // const handleReviewerChange = async ({ value }: any) => {
  //   setReviewerStatus(value); // Update local state immediately
  //   console.log(Status);
  //   console.log(props.hacker.reviewerStatus);

  //   try {
  //     await Hacker.updateReviewerStatus(props.hacker.id, value); // Persist change
  //     toast.success(`Reviewer status updated to ${value}`);
  //   } catch (error) {
  //     console.error("Error updating reviewer status:", error);
  //     toast.error("Failed to update reviewer status");
  //   }
  // };
  

  // const handleReviewerChange = ({ value }: any) => {
  //   setReviewerStatus(value);
  //   submitReviewer();
  // }

  const { hacker } = props;
  const account = (hacker.accountId as IAccount) || {};
  const pronoun = account.pronoun ? `(${account.pronoun})` : '';

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
                mb="0px"
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
              <Flex
                width="100%"
                flexWrap="wrap"
                justifyContent="start"
                alignItems="center"
                mb="0px"
                
              >
                {/* <Flex
                  justifyContent={['center', 'flex-start']}
                  alignItems="center"
                  ml="16px"
                > */}
                  {/* <Button
                    type="button"
                    onClick={submit}
                    variant={ButtonVariant.Primary}
                    isLoading={isLoading}
                    disabled={isLoading || !isAdmin}
                  >
                    Change status
                  </Button> */}
                <Box width={[1, 1/2]} style={{ paddingTop: '10px', marginRight: '17px' }}>
                  <Input
                    // onChange={this.onSearchBarChanged}
                    placeholder={'Reviewer Name'}
                    // value={searchBar}
                  />
                </Box>
                {/* </Flex> */}
                {/* <Box width={[1, 1/5.5]} style={{ paddingTop: '1px' }}> */}
                <Box width={'9.1rem'} style={{ paddingTop: '1px' }}>
                  <StyledSelect
                    isTight={true}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    options={getOptionsFromEnum(HackerReviewerStatus)}
                    isDisabled={!isAdmin}
                    onChange={handleReviewerChange}
                    value={{
                      label: reviewerStatus,
                      value: reviewerStatus,
                    }}
                  />
                </Box>
              </Flex>
              <Flex
                  justifyContent={['center', 'flex-start']}
                  alignItems="center"
                  ml="0px"
                  mt="-27px"
              >

                <Box width={'35rem'} style={{ paddingTop: '0px', marginRight: '17px' }}>
                  <Input
                    // onChange={this.onSearchBarChanged}
                    placeholder={'Comments'}
                    // value={searchBar}
                  />  
                </Box>
              </Flex>
              <Flex
                width="100%"
                flexWrap="wrap"
                justifyContent="start"
                alignItems="center"
                mb="0px"
                
              >
                <Box width={[1, 1/2]} style={{ paddingTop: '-10px', marginRight: '17px' }}>
                  <Input
                    // onChange={this.onSearchBarChanged}
                    placeholder={'Reviewer Name'}
                    // value={searchBar}
                  />
                </Box>
                {/* </Flex> */}
                {/* <Box width={[1, 1/5.5]} style={{ paddingTop: '1px' }}> */}
                <Box width={'9.1rem'} style={{ paddingTop: '-10px' }}>
                  <StyledSelect
                    isTight={true}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    options={getOptionsFromEnum(HackerReviewerStatus)}
                    isDisabled={!isAdmin}
                    onChange={handleRChange}
                    value={{
                      label: reviewerStatus2,
                      value: reviewerStatus2,
                    }}
                  />
                </Box>
              </Flex>
              <Flex
                  justifyContent={['center', 'flex-start']}
                  alignItems="center"
                  ml="0px"
                  mt="-27px"
              >

                <Box width={'35rem'} style={{ paddingTop: '0px', marginRight: '17px' }}>
                  <Input
                    // onChange={this.onSearchBarChanged}
                    placeholder={'Comments'}
                    // value={searchBar}
                  />  
                </Box>
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
            {/* <SHField label="ReviewerStatus" text={hacker.reviewerStatus} /> */}
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


// import React, { useEffect, useState } from 'react';
// import Helmet from 'react-helmet';

// import { Box, Flex } from '@rebass/grid';
// import { toast } from 'react-toastify';

// import { Hacker } from '../../api';
// import {
//   HACKATHON_NAME,
//   HackerStatus,
//   IAccount,
//   IHacker,
//   UserType,
// } from '../../config';
// import {
//   Button,
//   ButtonVariant,
//   H1,
//   H2,
//   MaxWidthBox,
// } from '../../shared/Elements';
// import ViewPDFComponent from '../../shared/Elements/ViewPDF';
// import { Form, StyledSelect } from '../../shared/Form';
// import ValidationErrorGenerator from '../../shared/Form/validationErrorGenerator';
// import theme from '../../shared/Styles/theme';

// //date2age is currently unused
// import { date2age, getOptionsFromEnum } from '../../util';

// import SHField from './SingleHackerField';
// import SHLink from './SingleHackerLink';
// import SHParagraph from './SingleHackerParagraph';
// import SingleHackerSection from './SingleHackerSection';

// interface IHackerViewProps {
//   hacker: IHacker;
//   userType: UserType;
// }

// const SingleHackerView: React.FC<IHackerViewProps> = (props) => {
//   const [status, setStatus] = useState(props.hacker.status);
//   const [isAdmin, setIsAdmin] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     setIsAdmin(props.userType === UserType.STAFF);
//   }, [props.userType]);

//   useEffect(() => {
//     setStatus(props.hacker.status);
//   }, [props]);

//   const submit = async () => {
//     try {
//       const { hacker } = props;
//       setIsLoading(true);
//       await Hacker.updateStatus(hacker.id, status);
//       setIsLoading(false);
//       toast.success(`Hacker status updated to ${status}!`);
//     } catch (e: any) {
//       if (e && e.data) {
//         ValidationErrorGenerator(e.data);
//       }
//     }
//   };

//   const handleChange = ({ value }: any) => {
//     setStatus(value);
//   };

//   const { hacker } = props;
//   const account = (hacker.accountId as IAccount) || {};
//   const pronoun = account.pronoun ? `(${account.pronoun})` : '';

//   return (
//     <article>
//       <Helmet>
//         <title>
//           {`${account.firstName} ${account.lastName}`} | {HACKATHON_NAME}
//         </title>
//       </Helmet>
//       <MaxWidthBox maxWidth="800px">
//         <Flex flexDirection={'column'} style={{ marginTop: '4em' }}>
//           <H1 marginLeft="0">
//             {`${account.firstName} ${account.lastName} ${pronoun}`}
//           </H1>
//         </Flex>
//         <hr hidden={isAdmin} />
//         <Box ml="6px">
//           <SingleHackerSection
//             title={'Administrative Information'}
//             hidden={!isAdmin}
//           >
//             <Form>
//               <Flex
//                 width="100%"
//                 flexWrap="wrap"
//                 justifyContent="start"
//                 alignItems="center"
//                 mb="16px"
//               >
//                 <Box width={[1, 1 / 2]} style={{ paddingTop: '10px' }}>
//                   <StyledSelect
//                     isTight={true}
//                     className="react-select-container"
//                     classNamePrefix="react-select"
//                     options={getOptionsFromEnum(HackerStatus)}
//                     isDisabled={!isAdmin}
//                     onChange={handleChange}
//                     value={{
//                       label: status,
//                       value: status,
//                     }}
//                   />
//                 </Box>
//                 <Flex
//                   justifyContent={['center', 'flex-start']}
//                   alignItems="center"
//                   ml="16px"
//                 >
//                   <Button
//                     type="button"
//                     onClick={submit}
//                     variant={ButtonVariant.Primary}
//                     isLoading={isLoading}
//                     disabled={isLoading || !isAdmin}
//                   >
//                     Change status
//                   </Button>
//                 </Flex>
//               </Flex>
//             </Form>
//             <Flex
//               width="100%"
//               flexWrap="wrap"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <SHField label="Age" text={account.age} />
//               <SHField
//                 label="Shirt Size"
//                 text={hacker.application.accommodation.shirtSize}
//               />
//               {/* Removed as shirt size is no longer a property of account
//                 <SHField label="Shirt Size" text={account.shirtSize} /> */}
//               <SHField label="Gender" text={account.gender} />
//               <SHLink
//                 label="Phone Number"
//                 link={`tel:${account.phoneNumber}`}
//                 linkText={account.phoneNumber}
//               />
//               <SHField
//                 label="Dietary Restrictions"
//                 text={
//                   account.dietaryRestrictions &&
//                   account.dietaryRestrictions.join(', ')
//                 }
//               />
//               <SHParagraph
//                 label="Impairments"
//                 text={hacker.application.accommodation.impairments}
//               />
//               <SHParagraph
//                 label="Barriers"
//                 text={hacker.application.accommodation.barriers}
//               />
//             </Flex>
//             <hr />
//           </SingleHackerSection>
//           <H2 color={theme.colors.black60}>Basic Information</H2>
//           <Flex
//             width="100%"
//             flexWrap="wrap"
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <SHField label="Email" text={account.email} />
//             <SHField label="School" text={hacker.application.general.school} />
//             <SHField label="Degree" text={hacker.application.general.degree} />
//             <SHField label="Status" text={hacker.status} />
//             <SHField
//               label="Graduation Year"
//               text={hacker.application.general.graduationYear}
//             />
//             <SHField
//               label="Field(s) of Study"
//               text={hacker.application.general.fieldOfStudy.join(', ')}
//             />
//             <SHField
//               label="Skills"
//               text={
//                 hacker.application.shortAnswer.skills &&
//                 hacker.application.shortAnswer.skills.join(', ')
//               }
//             />
//             <SHField
//               label="Job interest"
//               text={hacker.application.general.jobInterest}
//             />
//           </Flex>
//           <hr />
//           <H2 color={theme.colors.black60}>Links</H2>
//           <Flex
//             width="100%"
//             flexWrap="wrap"
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <SHLink
//               label="GitHub"
//               link={hacker.application.general.URL.github}
//             />
//             <SHLink
//               label="LinkedIn"
//               link={hacker.application.general.URL.linkedIn}
//             />
//             <SHLink
//               label="Website"
//               link={hacker.application.general.URL.other}
//             />
//             <SHLink
//               label="Dribbble"
//               link={hacker.application.general.URL.dribbble}
//             />
//           </Flex>
//           {/* Only tier1 sponsors and admin have access to user resumes */}
//           {props.userType === UserType.SPONSOR_T1 ||
//           props.userType === UserType.STAFF ? (
//             <Flex flexDirection={'column'} style={{ marginTop: '4em' }}>
//               <ViewPDFComponent hackerId={hacker.id} />
//             </Flex>
//           ) : null}
//           <SingleHackerSection title="Additional Information" hidden={!isAdmin}>
//             <SHParagraph
//               label="Why McHacks?"
//               text={hacker.application.shortAnswer.question1}
//             />
//             <SHParagraph
//               label="What are you passionate about?"
//               text={hacker.application.shortAnswer.question2}
//             />
//             <SHParagraph
//               label="Comments"
//               text={hacker.application.shortAnswer.comments}
//             />
//           </SingleHackerSection>
//         </Box>
//       </MaxWidthBox>
//     </article>
//   );
// };

// export default SingleHackerView;
