import {
  AttendenceOptions,
  DietaryRestriction,
  HackerStatus,
  HackerReviewerStatus,
  JobInterest,
  ShirtSize,
} from '.';

export interface IStatsResponse {
  stats: {
    total: number;
    status: { [key in HackerStatus]: number };
    reviewerStatus: { [key in HackerReviewerStatus]: number };
    school: { [key: string]: number };
    degree: { [key: string]: number };
    gender: { [key: string]: number };
    travel: { true: number; false: number };
    ethnicity: { [key: string]: number };
    country: { [key: string]: number };
    jobInterest: { [key in JobInterest]: number };
    major: { [key: string]: number };
    graduationYear: { [key: string]: number };
    dietaryRestriction: { [key in DietaryRestriction & string]: number };
    ShirtSize: { [key in ShirtSize]: number };
    attendancePreference: { [key in AttendenceOptions]: number };
    age: { [key: string]: number };
  };
}
