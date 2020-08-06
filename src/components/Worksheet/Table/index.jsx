import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

const Table = ({ data, selectedData, selectData }) => {
  const columns = [
    {
      dataField: 'worksheetId',
      text: 'Worksheet Id'
    },
    {
      dataField: 'inspectionType',
      text: 'Inspection Type',
    },
    {
      dataField: 'keyofficers',
      text: 'Key Officers',
      formatter: cell => cell.map(e => e.staffName).join(', ')
    },
    {
      dataField: 'auditTeam',
      text: 'Audit Team',
      formatter: cell => cell.map(e => e.auditorId).join(', ')
    },
    {
      dataField: 'reviewers',
      text: 'Reviewers',
      formatter: cell => cell.map(e => e.reviewer).join(', ')
    },
    {
      dataField: 'approver',
      text: 'Approver',
    },
    {
      dataField: 'initiator',
      text: 'Initiator',
    },
    {
      dataField: 'recordDate',
      text: 'Record Date',
    },
    {
      dataField: 'recordTime',
      text: 'Record Time',
    },
    {
      dataField: 'workstation',
      text: 'Workstation',
    },
    {
      dataField: 'worksheetStatus',
      text: 'Worksheet Status',
    },
  ];
  
  const selectRow = {
    mode: 'radio',
    clickToSelect: true,
    hideSelectColumn: !selectedData,
    onSelect: (row, isSelect, rowIndex, e) => {
      selectData(row)
    }
  };

  return (
    <BootstrapTable
      bootstrap4
      keyField='worksheetId'
      data={ data } 
      columns={ columns }
      striped
      hover
      bordered={ false }
      wrapperClasses="table-responsive"
      selectRow={ selectRow } 
      pagination={ paginationFactory({
        showTotal: true,
      }) }      
    />
  );
}

export default Table;