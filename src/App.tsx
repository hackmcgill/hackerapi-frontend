import * as React from 'react';
import Helmet from 'react-helmet';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ErrorPage from './pages/_error';
import ConfirmAccountPage from './pages/Account/Confirm';
import CreateAccountPage from './pages/Account/Create';
import EditAccountPage from './pages/Account/Edit';
import AdminSearchPage from './pages/Admin/Search';
import SettingsPage from './pages/Admin/Settings';
import ConfirmAttendancePage from './pages/Application/Confirm';
import CreateApplicationPage from './pages/Application/Create';
import EditApplicationPage from './pages/Application/Edit';
import SingleHackerPage from './pages/Application/View/[id]';
import CheckinPage from './pages/Hacker/Checkin';
import HackPassPage from './pages/Hacker/Pass';
import DashboardPage from './pages/index';
import LoginPage from './pages/Login/index';
import ForgotPasswordPage from './pages/Password/Forgot';
import ResetPasswordPage from './pages/Password/Reset';
import CreateSponsorPage from './pages/Sponsor/Create';
import EditSponsorPage from './pages/Sponsor/Edit';
import SponsorOnboardingPage from './pages/Sponsor/Onboarding';
import SponsorSearchPage from './pages/Sponsor/Search';
import TeamPage from './pages/Team/index';

import {
  FrontendRoute,
  HackerReviewerStatus,
  HackerStatus,
  IAccount,
  IHacker,
  UserType,
} from './config';
import * as CONSTANTS from './config/constants';

import withAuthRedirect from './shared/HOC/withAuthRedirect';
import withBackground from './shared/HOC/withBackground';
import withHackerRedirect from './shared/HOC/withHackerRedirect';
import withNavbar from './shared/HOC/withNavbar';
import withSponsorRedirect from './shared/HOC/withSponsorRedirect';
import withThemeProvider from './shared/HOC/withThemeProvider';
import withTokenRedirect from './shared/HOC/withTokenRedirect';

import InvitePage from './pages/Admin/Invite';
import {
  canAccessApplication,
  canAccessHackerPass,
  canAccessTeam,
  // canAccessTravel,
  isSponsor,
  userCanAccessHackerPage,
} from './util';
// import TravelPage from './pages/Travel';

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <>
          <Helmet>
            <title>{CONSTANTS.HACKATHON_NAME}</title>
            <meta property="og:title" content={CONSTANTS.HACKATHON_NAME} />
            <meta property="og:url" content={CONSTANTS.STATIC_SITE} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={CONSTANTS.HACKATHON_NAME} />
            <meta
              property="og:description"
              content={CONSTANTS.HACKATHON_DESCRIPTION}
            />
            <meta property="og:image" content={CONSTANTS.RICH_PREVIEW_IMAGE} />

            <meta name="twitter:card" content=" " />
            <meta name="twitter:title" content={CONSTANTS.HACKATHON_NAME} />
            <meta
              name="twitter:description"
              content={CONSTANTS.HACKATHON_DESCRIPTION}
            />
            <meta name="twitter:creator" content={CONSTANTS.TWITTER} />
            <meta name="twitter:image" content={CONSTANTS.RICH_PREVIEW_IMAGE} />
            <meta name="twitter:domain" content={CONSTANTS.HACKATHON_NAME} />
            <meta name="twitter:site" content={CONSTANTS.TWITTER} />
          </Helmet>
          <Routes>
            <Route
              path={FrontendRoute.HOME_PAGE}
              element={React.createElement(
                withBackground(
                  withNavbar(withAuthRedirect(DashboardPage), {
                    activePage: 'home',
                  })
                ),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.CREATE_ACCOUNT_PAGE}
              element={React.createElement(
                withBackground(
                  withNavbar(
                    withAuthRedirect(CreateAccountPage, {
                      requiredAuthState: false,
                    }),
                    { activePage: 'profile' }
                  )
                ),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.EDIT_ACCOUNT_PAGE}
              element={React.createElement(
                withBackground(
                  withNavbar(
                    withAuthRedirect(EditAccountPage, {
                      redirAfterLogin: true,
                      requiredAuthState: true,
                    }),
                    { activePage: 'profile' }
                  )
                ),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.RESET_PASSWORD_PAGE}
              element={React.createElement(
                withNavbar(withTokenRedirect(ResetPasswordPage)),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.CONFIRM_ACCOUNT_PAGE}
              element={React.createElement(
                withBackground(
                  withNavbar(
                    withAuthRedirect(ConfirmAccountPage, {
                      requiredAuthState: true,
                      redirAfterLogin: true,
                    }),
                    { activePage: 'home' }
                  )
                ),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.FORGOT_PASSWORD_PAGE}
              element={React.createElement(
                withNavbar(ForgotPasswordPage),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.WELL_KNOWN_PASSWORD_CHANGE}
              element={React.createElement(
                withNavbar(ForgotPasswordPage),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.CREATE_APPLICATION_PAGE}
              element={React.createElement(
                withBackground(
                  withNavbar(
                    withAuthRedirect(
                      withHackerRedirect(CreateApplicationPage, {
                        requiredAuthState: false,
                      }),
                      {
                        redirAfterLogin: true,
                        AuthVerification: (user: IAccount) =>
                          user.confirmed &&
                          user.accountType === UserType.HACKER,
                      }
                    ),
                    { activePage: 'application' }
                  )
                ),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.EDIT_APPLICATION_PAGE}
              element={React.createElement(
                withBackground(
                  withNavbar(
                    withAuthRedirect(
                      withHackerRedirect(EditApplicationPage, {
                        AuthVerification: canAccessApplication,
                      }),
                      {
                        requiredAuthState: true,
                        redirAfterLogin: true,
                        AuthVerification: (user: IAccount) =>
                          user.confirmed &&
                          user.accountType === UserType.HACKER,
                      }
                    ),
                    { activePage: 'application' }
                  )
                ),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.TEAM_PAGE}
              element={React.createElement(
                withBackground(
                  withNavbar(
                    withAuthRedirect(
                      withHackerRedirect(TeamPage, {
                        AuthVerification: canAccessTeam,
                      }),
                      {
                        requiredAuthState: true,
                        redirAfterLogin: true,
                        AuthVerification: (user: IAccount) =>
                          user.confirmed &&
                          user.accountType === UserType.HACKER,
                      }
                    ),
                    { activePage: 'team' }
                  )
                ),
                this.props
              )}
            />
            {/* <Route
              exact={true}
              path={FrontendRoute.TRAVEL_PAGE}
              component={withNavbar(
                withAuthRedirect(
                  withHackerRedirect(TravelPage, {
                    AuthVerification: canAccessTravel,
                  }),
                  {
                    requiredAuthState: true,
                    redirAfterLogin: true,
                    AuthVerification: (user: IAccount) =>
                      user.confirmed && user.accountType === UserType.HACKER,
                  }
                ),
                { activePage: 'travel' }
              )}
            /> */}
            <Route
              path={FrontendRoute.LOGIN_PAGE}
              element={React.createElement(
                withBackground(
                  withAuthRedirect(LoginPage, {
                    requiredAuthState: false,
                  })
                ),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.CONFIRM_HACKER_PAGE}
              element={React.createElement(
                withNavbar(
                  withAuthRedirect(
                    withHackerRedirect(ConfirmAttendancePage, {
                      requiredAuthState: true,
                      AuthVerification: (user: IHacker) =>
                        user.status === HackerStatus.HACKER_STATUS_ACCEPTED,
                    }),
                    {
                      redirAfterLogin: true,
                      AuthVerification: (user: IAccount) =>
                        user.confirmed && user.accountType === UserType.HACKER,
                    }
                  )
                ),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.ADMIN_SEARCH_PAGE}
              element={React.createElement(
                withBackground(
                  withNavbar(
                    withAuthRedirect(AdminSearchPage, {
                      requiredAuthState: true,
                      redirAfterLogin: true,
                      AuthVerification: (user: IAccount) =>
                        user.confirmed && user.accountType === UserType.STAFF,
                    }),
                    { activePage: 'search' }
                  )
                ),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.SETTINGS_PAGE}
              element={React.createElement(
                withBackground(
                  withNavbar(
                    withAuthRedirect(SettingsPage, {
                      requiredAuthState: true,
                      redirAfterLogin: true,
                      AuthVerification: (user: IAccount) =>
                        user.confirmed && user.accountType === UserType.STAFF,
                    }),
                    { activePage: 'settings' }
                  )
                ),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.INVITE_PAGE}
              element={React.createElement(
                withBackground(
                  withNavbar(
                    withAuthRedirect(InvitePage, {
                      requiredAuthState: true,
                      redirAfterLogin: true,
                      AuthVerification: (user: IAccount) =>
                        user.confirmed && user.accountType === UserType.STAFF,
                    }),
                    { activePage: 'invite' }
                  )
                ),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.SPONSOR_SEARCH_PAGE}
              element={React.createElement(
                withBackground(
                  withNavbar(
                    withAuthRedirect(SponsorSearchPage, {
                      requiredAuthState: true,
                      redirAfterLogin: true,
                      AuthVerification: (user: IAccount) =>
                        user.confirmed && isSponsor(user),
                    }),
                    { activePage: 'search' }
                  )
                ),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.SPONSOR_ONBOARDING_PAGE}
              element={React.createElement(
                withBackground(
                  withNavbar(
                    withAuthRedirect(SponsorOnboardingPage, {
                      requiredAuthState: true,
                      redirAfterLogin: true,
                      AuthVerification: (user: IAccount) =>
                        user.confirmed && isSponsor(user),
                    }),
                    { activePage: 'onboarding' }
                  )
                ),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.VIEW_HACKER_PAGE}
              element={React.createElement(
                withBackground(
                  withNavbar(
                    withAuthRedirect(SingleHackerPage, {
                      requiredAuthState: true,
                      redirAfterLogin: true,
                      AuthVerification: userCanAccessHackerPage,
                    })
                  )
                ),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.CHECKIN_HACKER_PAGE}
              element={React.createElement(
                withNavbar(
                  withAuthRedirect(CheckinPage, {
                    requiredAuthState: true,
                    AuthVerification: (user: IAccount) =>
                      user.confirmed &&
                      (user.accountType === UserType.STAFF ||
                        user.accountType === UserType.VOLUNTEER),
                  })
                ),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.CREATE_SPONSOR_PAGE}
              element={React.createElement(
                withBackground(
                  withNavbar(
                    withAuthRedirect(
                      withSponsorRedirect(CreateSponsorPage, {
                        requiredAuthState: false,
                      }),
                      {
                        redirAfterLogin: true,
                        AuthVerification: (user: IAccount) =>
                          user.confirmed && isSponsor(user),
                      }
                    ),
                    { activePage: 'sponsor' }
                  )
                ),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.PASS_HACKER_PAGE}
              element={React.createElement(
                withBackground(
                  withNavbar(
                    withAuthRedirect(
                      withHackerRedirect(HackPassPage, {
                        requiredAuthState: true,
                        AuthVerification: canAccessHackerPass,
                      }),
                      {
                        redirAfterLogin: true,
                        requiredAuthState: true,
                        AuthVerification: (user: IAccount) =>
                          user.confirmed &&
                          user.accountType === UserType.HACKER,
                      }
                    )
                  )
                ),
                this.props
              )}
            />
            <Route
              path={FrontendRoute.EDIT_SPONSOR_PAGE}
              element={React.createElement(
                withBackground(
                  withNavbar(
                    withAuthRedirect(
                      withSponsorRedirect(EditSponsorPage, {
                        requiredAuthState: true,
                      }),
                      {
                        redirAfterLogin: true,
                        AuthVerification: (user: IAccount) =>
                          user.confirmed && isSponsor(user),
                      }
                    ),
                    { activePage: 'sponsor' }
                  )
                ),
                this.props
              )}
            />
            <Route
              path="*"
              element={React.createElement(
                withBackground(withNavbar(ErrorPage)),
                this.props
              )}
            />
          </Routes>
        </>
      </BrowserRouter>
    );
  }
}

export default withThemeProvider(App);
