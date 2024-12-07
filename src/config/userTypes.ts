import HackerStatus from './hackerStatus';
import { ITeam } from './team';

export interface IAccount {
  accountType: UserType;
  confirmed: boolean;
  // The first name of the user
  firstName: string;
  // The last name of the user
  lastName: string;
  // The email of the user
  email: string;
  // The user's dietary restrictions
  dietaryRestrictions: string[];
  // The user's gender
  gender: string;
  // The password
  password: string;
  // The user's phone number
  phoneNumber: string;
  // The user's age
  age?: string;
  // The user's birthdate
  birthDate?: string;
  // The preferred pronoun
  pronoun: string;
  // The database id (if new, leave blank / make '')
  id: string;
  _id?: string;
}

export interface IHacker {
  [key: string]: any;
  id: string;
  accountId: string | IAccount; // for querying account as well
  status: HackerStatus;
  application: {
    general: {
      school: string;
      degree: string;
      fieldOfStudy: string[];
      graduationYear: number;
      jobInterest: string;
      URL: {
        resume: string | File;
        github?: string;
        dribbble?: string;
        personal?: string;
        linkedIn?: string;
        other?: string;
      };
    };
    shortAnswer: {
      // array of mongoose ids referencing different skills
      skills?: string[];
      // number of previously attended hackathons
      previousHackathons: number;
      // any miscelaneous comments that the user has
      comments?: string;
      // "Why do you want to come to our hackathon?"
      question1: string;
      // "Some q"
      question2: string;
    };
    other: {
      // no enum for these
      country: string;
      ethnicity: string[];
      sendEmail: boolean;
      privacyPolicy: boolean;
      codeOfConduct: boolean;
    };
    accommodation: {
      // The shirt size
      shirtSize: string;
      // If user is attending in-person or virtually (due to COVID)
      attendancePreference: string;
      // Any impairments the user might have
      impairments?: string;
      // Any barriers the user might have
      barriers?: string;
      // If the user requires a bus
      travel: {
        amount: number; // Amount requested
        reason: string; // Justification for the amount
      };
    };
  };
  teamId?: string | ITeam;
}

export interface ISponsor {
  // The sponsor's id
  id: string;
  // The Sponsor's account id.
  accountId: string;
  // What tier the sponsor is.
  tier: number;
  // The sponsor's company
  company: string;
  // The URL that of the contract that was signed with this sponsor
  contractURL: string;
  // The list of IDs of Hackers that this sponsor nominates.
  nominees: string[];
}

export enum UserType {
  UNKNOWN = 'Unknown',
  HACKER = 'Hacker',
  VOLUNTEER = 'Volunteer',
  STAFF = 'Staff',
  SPONSOR_T1 = 'SponsorT1',
  SPONSOR_T2 = 'SponsorT2',
  SPONSOR_T3 = 'SponsorT3',
  SPONSOR_T4 = 'SponsorT4',
  SPONSOR_T5 = 'SponsorT5',
}
