import { Box, Flex } from '@rebass/grid';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Account, Hacker } from '../../api';
import { FrontendRoute } from '../../config';
import { Email } from '../../features/Checkin/Email';
import { Reader } from '../../features/Checkin/Reader';
import { H1, MaxWidthBox } from '../../shared/Elements';
import ValidationErrorGenerator from '../../shared/Form/validationErrorGenerator';
import WithToasterContainer from '../../shared/HOC/withToaster';
import theme from '../../shared/Styles/theme';
import { generateHackPass } from '../../util';
import HackerCheckinForm from '../../features/Checkin/HackerCheckin';

const CheckinPage: React.FC = () => {
  // Is page currently busy doing something?
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Store details of last code scanned
  const [lastScan, setLastScan] = useState<string>('');

  /**
   * Check in a hacker.
   * @param id the id of the Hacker.
   * @returns boolean whether the hacker was properly checked in.
   */
  const checkinHacker = async (id: string): Promise<boolean> => {
    let checkedIn = false;
    setIsLoading(true);

    try {
      await Hacker.checkin(id);
      checkedIn = true;
      toast.success('Hacker checked in.');
      const hacker = (await Hacker.get(id)).data.data;
      const accountId =
        typeof hacker.accountId === 'string'
          ? hacker.accountId
          : hacker.accountId.id;
      const account = (await Account.get(accountId)).data.data;
      await generateHackPass(account, hacker);
      if (account.dietaryRestrictions.length > 0) {
        toast.info(
          `The user has the following dietary restrictions: ${account.dietaryRestrictions.join(
            ','
          )}`,
          {
            autoClose: false,
          }
        );
      }
      toast.info(`Shirt Size: ${hacker.application.accommodation.shirtSize}`, {
        autoClose: false,
      });
    } catch (e: any) {
      if (e && e.data) {
        ValidationErrorGenerator(e.data);
      }
    } finally {
      setIsLoading(false);
    }
    return checkedIn;
  };

  /**
   * Function which checks in a hacker as long as the provided data is of the correct format.
   * @param data Hacker ID, or the url to VIEW_HACKER_PAGE, such as 5c0dd463d95414ef5efd14cd, or https://app.mchacks.ca/application/view/5c0dd463d95414ef5efd14cd
   */
  const handleScan = async (data: string | null) => {
    if (data && !isLoading && lastScan !== data) {
      setLastScan(data);
      data = data.trim();
      const subRouteRegex = FrontendRoute.VIEW_HACKER_PAGE.replace(
        ':id',
        '[a-f\\d]{24}'
      );
      const hackerURL = new RegExp(`^http(s)?://.+${subRouteRegex}`);
      if (hackerURL.test(data)) {
        const url = data.split('/');
        data = url[url.length - 1];
      }
      if (!data.match(/^[a-f\d]{24}$/i)) {
        toast.error('Invalid QR Code');
        return;
      }
      await checkinHacker(data);
    }
  };

  /**
   * If error scanning an code, display a toast popup with error message
   * @param err the error thrown
   */
  const handleScanError = (err: any) => {
    toast.error(err);
  };

  /**
   * Checkin hacker with a certain email address, if that address is valid
   * @param email the email to attempt to find & checkin a hacker for
   */
  const handleEmail = async (email: string) => {
    setIsLoading(true);
    try {
      const hacker = (await Hacker.getByEmail(email)).data.data;
      await checkinHacker(hacker.id);
    } catch (e: any) {
      if (e && e.data) {
        ValidationErrorGenerator(e.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex flexDirection={'column'}>
      <Box>
        <H1
          fontSize={'30px'}
          textAlign={'center'}
          marginBottom={'20px'}
          marginLeft={'0px'}
        >
          Check in Hacker
        </H1>
      </Box>
      <Box>
        <Flex
          flexWrap={'wrap'}
          justifyContent={'space-evenly'}
          alignItems={'flex-start'}
        >
          <MaxWidthBox maxWidth={'330px'} width={1}>
            <H1
              color={theme.colors.black80}
              fontSize={'24px'}
              textAlign={'left'}
              marginBottom={'20px'}
              marginLeft={'0px'}
            >
              By QR Code:
            </H1>
            <Box>
              <Reader onError={handleScanError} onScan={handleScan} />
            </Box>
          </MaxWidthBox>
          <MaxWidthBox maxWidth={'330px'} width={1}>
            <H1
              color={theme.colors.black80}
              fontSize={'24px'}
              textAlign={'left'}
              marginBottom={'20px'}
              marginLeft={'0px'}
            >
              By Email:
            </H1>
            <Box alignSelf={'center'}>
              <Email onSubmit={handleEmail} />
            </Box>
          </MaxWidthBox>
        </Flex>

        <HackerCheckinForm />
      </Box>
    </Flex>
  );
};

export default WithToasterContainer(CheckinPage);
