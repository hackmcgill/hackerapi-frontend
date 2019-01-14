import * as React from 'react';

import { IHacker, UserType } from '../config';
import { StyledTable } from '../shared/Elements';
import SingleHackerModal from './SingleHackerModal';

interface IResultsTableProps {
  results: Array<{
    selected: boolean;
    hacker: IHacker;
  }>;
  loading: boolean;
  userType: UserType;
}

const ResultsTable: React.StatelessComponent<IResultsTableProps> = (props) => {
  const adminColumns = [
    {
      Header: 'First Name',
      accessor: 'hacker.accountId.firstName',
    },
    {
      Header: 'Last Name',
      accessor: 'hacker.accountId.lastName',
    },
    {
      Header: 'School',
      accessor: 'hacker.school',
    },
    {
      Header: 'Major',
      accessor: 'hacker.major',
    },
    {
      Header: 'Grad Year',
      accessor: 'hacker.graduationYear',
    },
    {
      Header: 'Status',
      accessor: 'hacker.status',
    },
    {
      Header: 'Applicant Info',
      Cell: ({ original }: any) => (
        <SingleHackerModal hacker={original.hacker} />
      ),
    },
  ];

  const volunteerColumns = [
    {
      Header: 'First Name',
      accessor: 'hacker.accountId.firstName',
    },
  ];
  return (
    <StyledTable
      data={props.results}
      columns={
        props.userType === UserType.STAFF ? adminColumns : volunteerColumns
      }
      loading={props.loading}
      defaultPageSize={10}
      // filterable={true}
      // defaultFilterMethod={filterer}
    />
  );
};

// function filterer(filter: Filter, row: any, column: any): boolean {
//   return String(row[filter.id])
//     .trim()
//     .toLowerCase()
//     .includes(
//       String(filter.value)
//         .trim()
//         .toLowerCase()
//     );
// }

export { ResultsTable };
