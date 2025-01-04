import { Box, Flex } from '@rebass/grid';
import fileDownload from 'js-file-download';
import * as React from 'react';
import Helmet from 'react-helmet';

import { Account, Search, Sponsor } from '../../api';
import {
  HACKATHON_NAME,
  IAccount,
  IHacker,
  ISearchParameter,
  ISponsor,
  isValidSearchParameter,
  UserType,
} from '../../config';
import * as CONSTANTS from '../../config/constants';
import { Button, ButtonVariant, H1, H2 } from '../../shared/Elements';
import { Input } from '../../shared/Form';
import ValidationErrorGenerator from '../../shared/Form/validationErrorGenerator';
import WithToasterContainer from '../../shared/HOC/withToaster';
import theme from '../../shared/Styles/theme';
import { getNestedAttr, getValueFromQuery, isSponsor } from '../../util';

import withContext from '../../shared/HOC/withContext';
import { FilterComponent } from './Filters';
import { ResultsTable } from './ResultsTable';

interface IResult {
  /**
   * For now, we aren't exposing 'selected' attribute. We set it default equal to true.
   * This is used for batch operations for changing hacker data.
   */
  selected: boolean;
  hacker: IHacker;
}

interface ISearchState {
  model: string;
  query: ISearchParameter[];
  results: IResult[];
  searchBar: string;
  loading: boolean;
  viewSaved: boolean;
  account?: IAccount;
  sponsor?: ISponsor;
}

class SearchContainer extends React.Component<{}, ISearchState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      model: 'hacker',
      query: this.getSearchFromQuery(),
      results: [],
      searchBar: this.getSearchBarFromQuery(),
      loading: false,
      viewSaved: false,
    };

    this.onFilterChange = this.onFilterChange.bind(this);
    this.triggerSearch = this.triggerSearch.bind(this);
    this.downloadData = this.downloadData.bind(this);
    this.onResetForm = this.onResetForm.bind(this);
    this.onSearchBarChanged = this.onSearchBarChanged.bind(this);
  }

  public render() {
    const { searchBar, account, query, loading, viewSaved } = this.state;
    return (
      <Flex flexDirection={'column'}>
        <Helmet>
          <title> Search | {HACKATHON_NAME}</title>
        </Helmet>
        <Box width={1 / 6} alignSelf={'center'}>
          <H1 color={theme.colors.red} fontSize={'30px'}>
            Search Hackers
          </H1>
        </Box>
        <Box width={1}>
          <Flex>
            <Box width={1 / 6} mx={2}>
              <H2>Filters</H2>
              <FilterComponent
                initFilters={query}
                onChange={this.onFilterChange}
                onResetForm={this.onResetForm}
                loading={loading}
              />
            </Box>
            <Box width={5 / 6} mx={2}>
              <Flex flexDirection={'column'}>
                <Box width={6 / 6}>
                  <Flex justifyContent={'space-between'}>
                    <Box alignSelf={'flex-start'} width={0.5}>
                      <Input
                        onChange={this.onSearchBarChanged}
                        placeholder={'Refine your search...'}
                        style={{ marginTop: 5 }}
                        value={searchBar}
                      />
                    </Box>
                    <Box mr={'10px'}>
                      {account && account.accountType === UserType.STAFF && (
                        <Button
                          style={{ marginRight: '10px' }}
                          variant={ButtonVariant.Secondary}
                          isOutlined={true}
                        >
                          Update Status
                        </Button>
                      )}
                      {account && isSponsor(account) && (
                        <Button
                          onClick={this.toggleSaved}
                          style={{ marginRight: '10px' }}
                          variant={ButtonVariant.Secondary}
                          isOutlined={true}
                        >
                          View {viewSaved ? 'All' : 'Saved'}
                        </Button>
                      )}
                      <Button
                        onClick={this.downloadData}
                        variant={ButtonVariant.Secondary}
                        isOutlined={true}
                      >
                        Export Hackers
                      </Button>
                    </Box>
                  </Flex>
                </Box>
                <ResultsTable
                  results={this.filter()}
                  loading={loading}
                  userType={account ? account.accountType : UserType.UNKNOWN}
                  filter={searchBar}
                />
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Flex>
    );
  }
  public async componentDidMount() {
    const account = (await Account.getSelf()).data.data;
    this.setState({ account });

    if (isSponsor(account)) {
      const sponsor = (await Sponsor.getSelf()).data.data;
      this.setState({ sponsor });
    }
    await this.triggerSearch();
  }
  private getSearchFromQuery(): ISearchParameter[] {
    const search = getValueFromQuery('q');
    if (!search) {
      return [];
    }
    try {
      const searchParam = JSON.parse(search);
      if (!Array.isArray(searchParam)) {
        return [];
      }
      const isValidSearch =
        searchParam
          .map((value: any): boolean => {
            return isValidSearchParameter(value);
          })
          .indexOf(false) === -1;
      return isValidSearch ? searchParam : [];
    } catch (e) {
      return [];
    }
  }

  private getSearchBarFromQuery(): string {
    const search = getValueFromQuery('searchBar');
    return search ? decodeURIComponent(search) : '';
  }

  private downloadData(): void {
    const headers = [
      { label: CONSTANTS.FIRST_NAME_LABEL, key: 'accountId.firstName' },
      { label: CONSTANTS.LAST_NAME_LABEL, key: 'accountId.lastName' },
      { label: CONSTANTS.EMAIL_LABEL, key: 'accountId.email' },
      { label: CONSTANTS.SCHOOL_LABEL, key: 'application.general.school' },
      {
        label: CONSTANTS.FIELD_OF_STUDY_LABEL,
        key: 'application.general.fieldOfStudy',
      },
      {
        label: CONSTANTS.GRADUATION_YEAR_LABEL,
        key: 'application.general.graduationYear',
      },
      { label: CONSTANTS.DEGREE_LABEL, key: 'application.general.degree' },
      {
        label: CONSTANTS.JOBINTEREST_LABEL,
        key: 'application.general.jobInterest',
      },
    ];
    // Return all fields for admin, and only subset for sponsors
    if (
      this.state.account &&
      this.state.account.accountType === UserType.STAFF
    ) {
      headers.push({ label: CONSTANTS.AGE_LABEL, key: 'accountId.age' });
      headers.push({ label: CONSTANTS.PHONE_NUMBER_LABEL, key: 'accountId.age' });
      headers.push({ label: 'Resume', key: 'application.general.URL.resume' });
      headers.push({ label: 'Github', key: 'application.general.URL.github' });
      headers.push({
        label: CONSTANTS.PERSONAL_LABEL,
        key: 'application.general.URL.personal',
      });
      headers.push({
        label: CONSTANTS.LINKEDIN_LINK_LABEL,
        key: 'application.general.URL.linkedin',
      });
      headers.push({
        label: CONSTANTS.OTHER_LINK_LABEL,
        key: 'application.general.URL.other',
      });
      headers.push({
        label: 'Number of previous hackathons', 
        key: 'application.shortAnswer.previousHackathons'
      })
      headers.push({
        label: CONSTANTS.SKILLS_LABEL,
        key: 'application.shortAnswer.skills',
      });
      headers.push({
        label: CONSTANTS.COMMENTS_LABEL,
        key: 'application.shortAnswer.comments',
      });
      headers.push({
        label: CONSTANTS.QUESTION1_REQUEST_LABEL,
        key: 'application.shortAnswer.question1',
      });
      headers.push({
        label: CONSTANTS.QUESTION2_REQUEST_LABEL,
        key: 'application.shortAnswer.question2',
      });
      headers.push({
        label: CONSTANTS.SHIRT_SIZE_LABEL,
        key: 'application.accommodation.shirtSize',
      });
      // headers.push({
      //   label: CONSTANTS.ATTENDENCE_OPTION_PREFERENCE_LABEL,
      //   key: 'application.accommodation.attendancePreference',
      // });
      headers.push({
        label: CONSTANTS.IMPAIRMENTS_LABEL,
        key: 'application.accommodation.impairments',
      });
      headers.push({
        label: CONSTANTS.BARRIERS_LABEL,
        key: 'application.accommodation.barriers',
      });
      // headers.push({
      //   label: CONSTANTS.TRAVEL_LABEL,
      //   key: 'application.accommodation.travel',
      // });
      headers.push({
        label: CONSTANTS.ETHNICITY_LABEL,
        key: 'application.other.ethnicity',
      });
      headers.push({
        label: CONSTANTS.COUNTRY_LABEL,
        key: 'application.other.country',
      });
      headers.push({ label: CONSTANTS.GENDER_LABEL, key: 'accountId.gender' });
      headers.push({
        label: CONSTANTS.PRONOUN_LABEL,
        key: 'accountId.pronoun',
      });
      headers.push({label: CONSTANTS.DIETARY_RESTRICTIONS_LABEL, key: 'accountId.dietaryRestrictions'});
      headers.push({label: 'Authorize MLH to send emails', key: 'application.other.sendEmail'})
    }

    const tempHeaders: string[] = [];
    headers.forEach((header) => {
      tempHeaders.push(header.label);
    });
    
    const csvData: string[] = [tempHeaders.join(',')]; 

    this.filter().forEach((result) => {
      if (result.selected) {
        const row: string[] = [];
        headers.forEach((header) => {
          let value;
          let free_response = false;

          if (header.key.indexOf('.') >= 0) {

            // Check if the field is a free-form response
            if (header.key == "application.shortAnswer.question1" || header.key == "application.shortAnswer.question2" || header.key == "application.shortAnswer.comments") {
              free_response = true
            }
            
            // Get the value of the field by navigating the nested structure of the hacker object,
            // using the header key to determine the path 
            const nestedAttr = header.key.split('.');
            value = getNestedAttr(result.hacker, nestedAttr);

            // Format free responses to be properly parsed as comma-separated value (CSV)
            if (free_response == true){

              // If the value contains any quotes, newlines, tabs, or commas, wrap it in double quotes
              if (/['"/n/t,]/.test(value)) {
                value = `"${value}"`
              }
            }
            
          } else {
            value = result.hacker[header.key];
          }
          row.push(value);
        });
        csvData.push(row.join(','));
      }
    });

    // Make sure that file is encoded as UTF-8 so that all characters are properly displayed
    const bom = '\uFEFF'; // UTF-8 BOM
    fileDownload(bom + csvData.join('\n'), 'hackerData.csv', 'text/csv');
    
  }

  private async triggerSearch(): Promise<void> {
    this.setState({ loading: true });
    const { model, query } = this.state;
    try {
      const response = await Search.search(model, query, {
        expand: true,
      });
      const isArray = Array.isArray(response.data.data);
      const tableData = isArray
        ? response.data.data.map((v) => ({
            selected: true,
            hacker: v,
          }))
        : [];
      this.setState({ results: tableData, loading: false });
    } catch (e: any) {
      ValidationErrorGenerator(e.data);
      this.setState({ loading: false });
    }
  }
  private onResetForm() {
    this.setState({ query: [] });
    this.updateQueryURL([], this.state.searchBar);
  }

  private onFilterChange(newFilters: ISearchParameter[]) {
    this.setState({
      query: newFilters,
    }, () => {
      this.updateQueryURL(newFilters, this.state.searchBar);
      this.triggerSearch();
    });
  }

  private onSearchBarChanged(e: any) {
    const searchBar = e.target.value;
    this.setState({ searchBar });
    this.updateQueryURL(this.state.query, searchBar);
  }

  private updateQueryURL(filters: ISearchParameter[], searchBar: string) {
    const newSearch = `?q=${encodeURIComponent(
      JSON.stringify(filters)
    )}&searchBar=${encodeURIComponent(searchBar)}`;
    window.history.replaceState(
      null,
      '',
      window.location.href.split('?')[0] + newSearch
    );
  }

  private filter() {
    const { sponsor, viewSaved, results } = this.state;
    const searchBar = this.state.searchBar.toLowerCase();
    return results.filter(({ hacker }) => {
      const { accountId } = hacker;
      let foundAcct;
      if (typeof accountId !== 'string') {
        const account = accountId as IAccount;
        if (account) {
          const fullName =
            `${account.firstName} ${account.lastName}`.toLowerCase();
          foundAcct =
            fullName.includes(searchBar) ||
            account.email.toLowerCase().includes(searchBar) ||
            account.phoneNumber.toString().includes(searchBar) ||
            account.gender.toLowerCase().includes(searchBar) ||
            (account._id && account._id.includes(searchBar));
        }
      } else {
        foundAcct = accountId.includes(searchBar);
      }
      const foundHacker =
        hacker.id.includes(searchBar) ||
        hacker.application.general.school.includes(searchBar) ||
        hacker.application.general.degree.includes(searchBar) ||
        hacker.application.general.fieldOfStudy.includes(searchBar) ||
        hacker.application.general.graduationYear
          .toString()
          .includes(searchBar) ||
        hacker.application.general.jobInterest.includes(searchBar) ||
        hacker.status.includes(searchBar) ||
        hacker.application.shortAnswer.question1.includes(searchBar) ||
        hacker.application.shortAnswer.question2.includes(searchBar) ||
        hacker.application.accommodation.shirtSize.includes(searchBar) ||
        hacker.application.accommodation.attendancePreference.includes(
          searchBar
        ) ||
        (hacker.application.shortAnswer.skills &&
          hacker.application.shortAnswer.skills.toString().includes(searchBar));

      const isSavedBySponsorIfToggled =
        !viewSaved ||
        (sponsor && sponsor.nominees.some((n) => n === hacker.id));

      return (foundAcct || foundHacker) && isSavedBySponsorIfToggled;
    });
  }

  private toggleSaved = async () => {
    // Resets the sponsor if they made changes to their saved hackers
    const sponsor = (await Sponsor.getSelf()).data.data;
    const { viewSaved } = this.state;
    if (sponsor) {
      this.setState({ sponsor, viewSaved: !viewSaved });
    }
  };
}

export default withContext(WithToasterContainer(SearchContainer));
