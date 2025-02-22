export enum APIRoute {
  // Auth routes
  AUTH_LOGIN = 'auth/login',
  AUTH_LOGOUT = 'auth/logout',
  AUTH_FORGOT_PASS = 'auth/password/forgot',
  AUTH_RESET_PASS = 'auth/password/reset',
  AUTH_CONFIRM_ACCT = 'auth/confirm',
  AUTH_RESEND_CONF_EMAIL = 'auth/confirm/resend',
  AUTH_CHANGE_PASS = 'auth/password/change',

  // Account routes
  ACCOUNT = 'account',
  ACCOUNT_SELF = 'account/self',
  ACCOUNT_INVITE = 'account/invite',
  // Hacker routes
  HACKER = 'hacker',
  HACKER_EMAIL = 'hacker/email',
  HACKER_CHECKIN = 'hacker/checkin',
  HACKER_CONFIRMATION = 'hacker/confirmation',
  HACKER_RESUME = 'hacker/resume',
  HACKER_SELF = 'hacker/self',
  HACKER_STATS = 'hacker/stats',
  HACKER_STATUS = 'hacker/status',
  HACKER_REVIEWER_STATUS = 'hacker/reviewerStatus',
  // Travel routes
  TRAVEL = 'travel',
  TRAVEL_EMAIL = 'travel/email',
  TRAVEL_SELF = 'travel/self',
  // Search routes
  SEARCH = 'search',
  // Settings routes
  SETTINGS = 'settings',
  // Sponsor routes
  SPONSOR = 'sponsor',
  SPONSOR_SELF = 'sponsor/self',

  TEAM = 'team',
  TEAM_JOIN = 'team/join',
  TEAM_LEAVE = 'team/leave',
}
export default APIRoute;
