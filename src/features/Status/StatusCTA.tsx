import React from 'react';

import { Flex } from '@rebass/grid';
import computer2 from '../../assets/images/computer2.svg';
import developer from '../../assets/images/developer.svg';
import hacker from '../../assets/images/hacker.svg';
import rocket from '../../assets/images/rocket.svg';
import { FrontendRoute, HackerStatus, HackerReviewerStatus, ISetting } from '../../config';
import * as CONSTANTS from '../../config/constants';
import {
  Button,
  ButtonVariant,
  H1,
  Image,
  LinkDuo,
} from '../../shared/Elements';
import theme from '../../shared/Styles/theme';
import { date2human } from '../../util';

/**
 * These enums represent states + actions in this diagram: https://bit.ly/3ldYbgV.
 * These differ from HackerStatus in that HackerStatus does not incorporate time-based information.
 */
enum DetailedState {
  NONE_CANNOT_YET_APPLY,
  NONE_CAN_APPLY,
  NONE_MISSED_DEADLINE,
  APPLIED,
  ACCEPTED_CAN_CONFIRM_OR_WITHDRAW,
  ACCEPTED_MISSED_DEADLINE,
  DECLINED,
  WAITLISTED,
  CONFIRMED,
  CHECKED_IN,
  WITHDRAWN,
}

interface IStatusHeaderProps {
  status: HackerStatus;
  firstName: string;
  settings: ISetting;
  onClickConfirm: (e: any) => Promise<void>;
  onClickWithdraw: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Inform the hacker of their current application status and give them the really important actions they
 * can do right now
 */
const StatusCTA: React.FC<IStatusHeaderProps> = ({
  status,
  firstName,
  settings,
  onClickConfirm,
  onClickWithdraw,
}) => {
  const confirmButton = (
    <Button
      type="button"
      onClick={onClickConfirm}
      variant={ButtonVariant.Primary}
    >
      Confirm
    </Button>
  );
  const withdrawButton = (
    <Button
      type="button"
      onClick={onClickWithdraw}
      variant={ButtonVariant.Secondary}
      isOutlined={true}
    >
      Withdraw
    </Button>
  );
  const applyButton = (
    <LinkDuo to={FrontendRoute.CREATE_APPLICATION_PAGE}>
      <Button type="button" variant={ButtonVariant.Secondary}>
        Apply
      </Button>
    </LinkDuo>
  );
  const liveSiteButton = (
    /* link not made yet */
    <LinkDuo to={FrontendRoute.CREATE_APPLICATION_PAGE}>
      <Button type="button" variant={ButtonVariant.Secondary}>
        Event Info
      </Button>
    </LinkDuo>
  );
  const hackPassButton = (
    <LinkDuo to={FrontendRoute.PASS_HACKER_PAGE}>
      <Button type="button" variant={ButtonVariant.Secondary}>
        Hack Pass
      </Button>
    </LinkDuo>
  );
  // const travelButton = (
  //   <LinkDuo to={FrontendRoute.TRAVEL_PAGE}>
  //     <Button type="button" variant={ButtonVariant.Secondary}>
  //       Travel
  //     </Button>
  //   </LinkDuo>
  // );

  // Possible choices for art
  const rocketArt = (
    <Image
      src={rocket}
      imgHeight="300px"
      imgWidth="min(100%, 100vw)"
      padding={'0 0 68px 0'}
    />
  );
  const computerArt = (
    <Image
      src={computer2}
      imgHeight="300px"
      imgWidth="min(100%, 100vw)"
      padding={'0 0 68px 0'}
    />
  );
  const developerArt = (
    <Image
      src={developer}
      imgHeight="300px"
      imgWidth="min(100%, 100vw)"
      padding={'0 0 68px 0'}
    />
  );
  const developerArtSmall = (
    <Image
      src={developer}
      imgHeight="280px"
      imgWidth="min(100%, 100vw)"
      padding={'0 0 68px 0'}
    />
  );
  const hackerArt = (
    <Image
      src={hacker}
      imgHeight="300px"
      imgWidth="min(100%, 100vw)"
      padding={'0 0 68px 0'}
    />
  );

  let heading = 'Hey ' + firstName + ',';
  let text;
  let art = null;
  let buttons: JSX.Element[] = [];

  const action = GetDetailedState(status, settings);
  switch (action) {
    case DetailedState.NONE_CANNOT_YET_APPLY:
      text = CONSTANTS.CANNOT_YET_APPLY_LABEL;
      art = computerArt;
      break;
    case DetailedState.NONE_CAN_APPLY:
      heading = CONSTANTS.NONE_STATUS_HEADING;
      text = CONSTANTS.NONE_STATUS_TEXT;
      art = rocketArt;
      buttons = [applyButton];
      break;
    case DetailedState.NONE_MISSED_DEADLINE:
      text = CONSTANTS.DEADLINE_PASSED_LABEL;
      art = computerArt;
      break;
    case DetailedState.APPLIED:
      heading = CONSTANTS.APPLIED_STATUS_HEADING;
      text = (
        <span>
          {CONSTANTS.APPLIED_STATUS_TEXT}
          {CONSTANTS.SOCIAL_MEDIA_PROMPT_START}
          <a
            href="https://www.facebook.com/mcgillhacks/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          ,{' '}
          <a
            href="https://twitter.com/McGillHacks?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          , and{' '}
          <a
            href="https://www.instagram.com/mcgillhacks/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          {CONSTANTS.SOCIAL_MEDIA_PROMPT_END}
        </span>
      );
      art = computerArt;
      break;
    case DetailedState.ACCEPTED_CAN_CONFIRM_OR_WITHDRAW:
      heading = CONSTANTS.ACCEPTED_STATUS_HEADING;
      text = `${CONSTANTS.ACCEPTED_STATUS_TEXT}${' '}
      ${CONSTANTS.RSVP_DEADLINE_TEXT_START}${' '}
      ${date2human(settings.confirmTime)}${' '}
      ${CONSTANTS.RSVP_DEADLINE_TEXT_END}`;
      art = developerArtSmall;
      buttons = [withdrawButton, confirmButton];
      break;
    case DetailedState.ACCEPTED_MISSED_DEADLINE:
      text = CONSTANTS.DECISION_DEADLINE_PASSED_LABEL;
      art = developerArt;
      break;
    case DetailedState.DECLINED:
      text = CONSTANTS.DECLINED_STATUS_TEXT;
      art = hackerArt;
      break;
    case DetailedState.WAITLISTED:
      text = CONSTANTS.WAITLISTED_STATUS_TEXT;
      art = hackerArt;
      break;
    case DetailedState.CONFIRMED:
      text = CONSTANTS.CONFIRMED_STATUS_TEXT;
      if (!settings.isRemote) {
        buttons = [hackPassButton, withdrawButton];
      } else {
        buttons = [hackPassButton, liveSiteButton, withdrawButton];
      }
      art = hackerArt;
      break;
    case DetailedState.CHECKED_IN:
      heading = CONSTANTS.CHECKED_IN_STATUS_HEADING;
      text = CONSTANTS.CHECKED_IN_STATUS_TEXT;
      buttons = [liveSiteButton];
      art = rocketArt;
      break;
    case DetailedState.WITHDRAWN:
      text = CONSTANTS.WITHDRAWN_STATUS_TEXT;
      art = developerArt;
      break;
  }
  return (
    <Flex
      justifyContent={'center'}
      alignItems={'center'}
      flexDirection={'column'}
    >
      <div className="art">{art}</div>

      <H1 marginBottom="0" textAlign="center">
        {heading}
      </H1>

      <div className="status-details">{text}</div>

      <Flex flexDirection={'row'} justifyContent={'space-around'}>
        {insertMargin(buttons)}
      </Flex>

      <style jsx={true}>{`
        .status-details {
          max-width: 500px;
          text-align: center;

          margin-top: 28px;
          margin-bottom: ${buttons.length > 0 ? '68px' : '0'};

          font-size: 20px;
          color: ${theme.colors.black80};
          font-family: ${theme.fonts.header};
        }

        @media screen and (max-height: 670px) {
          h1 {
            margin-top: 68px;
          }

          .art {
            height: 80px;
            visibility: hidden;
          }

          .status-details {
            margin-bottom: 28px;
          }
        }
      `}</style>
    </Flex>
  );
};

function insertMargin(buttons: JSX.Element[]) {
  const buttonsWithMargin: JSX.Element[] = [];
  for (let i = 0; i < buttons.length; i++) {
    if (i < buttons.length - 1) {
      buttonsWithMargin.push(
        <div key={i} style={{ marginRight: '20px' }}>
          {buttons[i]}
        </div>
      );
    } else {
      buttonsWithMargin.push(<div key={i}>{buttons[i]}</div>);
    }
  }
  return buttonsWithMargin;
}

/**
 * Gets the time-aware status of a given hacker.
 * This is important for knowing which text to show to the hacker, as well as which buttons to display.
 * @param status HackerStatus the status of the current hacker
 * @param settings the settings of this hackathon
 */
function GetDetailedState(
  status: HackerStatus,
  settings: ISetting
): DetailedState {
  const now = new Date();
  const openTime = new Date(settings.openTime);
  const closeTime = new Date(settings.closeTime);
  const confirmTime = new Date(settings.confirmTime);

  const inPreApplyWindow = now < openTime;
  const inApplyWindow = now > openTime && now < closeTime;
  const inConfirmWindow = now < confirmTime;

  if (status === HackerStatus.HACKER_STATUS_NONE) {
    if (inPreApplyWindow) {
      return DetailedState.NONE_CANNOT_YET_APPLY;
    } else if (inApplyWindow) {
      return DetailedState.NONE_CAN_APPLY;
    } else {
      return DetailedState.NONE_MISSED_DEADLINE;
    }
  } else if (status === HackerStatus.HACKER_STATUS_APPLIED) {
    return DetailedState.APPLIED;
  } else if (status === HackerStatus.HACKER_STATUS_ACCEPTED) {
    if (inConfirmWindow) {
      // This is any time before the confirmation date
      return DetailedState.ACCEPTED_CAN_CONFIRM_OR_WITHDRAW;
    } else {
      return DetailedState.ACCEPTED_MISSED_DEADLINE;
    }
  } else if (status === HackerStatus.HACKER_STATUS_DECLINED) {
    return DetailedState.DECLINED;
  } else if (status === HackerStatus.HACKER_STATUS_WAITLISTED) {
    return DetailedState.WAITLISTED;
  } else if (status === HackerStatus.HACKER_STATUS_CONFIRMED) {
    return DetailedState.CONFIRMED;
  } else if (status === HackerStatus.HACKER_STATUS_CHECKED_IN) {
    return DetailedState.CHECKED_IN;
  } else if (status === HackerStatus.HACKER_STATUS_WITHDRAWN) {
    return DetailedState.WITHDRAWN;
  }
  console.warn('Unknown hacker state');
  return DetailedState.NONE_MISSED_DEADLINE;
}

export default StatusCTA;
