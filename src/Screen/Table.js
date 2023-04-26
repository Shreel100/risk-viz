import React from 'react';
import Papa from 'papaparse';
import Data from '../data.csv';
import { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import NavBar from '../NavBar';
import { useSelector } from 'react-redux';

export default function DataTable() {
  const [data, setData] = useState([]);
  const selectedYear = useSelector((state) => state.year);

  const columns = [
    { dataField: 'ID', text: 'ID' },
    { dataField: 'Asset Name', text: 'Asset Name', sort: true, filter: textFilter() },
    { dataField: 'Lat', text: 'Latitude' },
    { dataField: 'Long', text: 'Longitude' },
    { dataField: 'Business Category', text: 'Business Category', sort: true },
    { dataField: 'Risk Rating', text: 'Risk Rating', sort: true },
    { dataField: 'RiskFactors', text: 'RiskFactors', sort: true, filter: textFilter() },
    { dataField: 'Year', text: 'Year', sort: true, filter: textFilter({ defaultValue: selectedYear }) },
  ];

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 50,
    lastPageText: '>>',
    firstPageText: '<<',
    nextPageText: '>',
    prePageText: '<',
    showTotal: true,
    onPageChange: function (page, sizePerPage) {
      console.log('page', page);
      console.log('sizePerpage', sizePerPage);
    },
    onSizePerPageChange: function (page, sizePerPage) {
      console.log('page', page);
      console.log('sizePerpage', sizePerPage);
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(Data);
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csvData = decoder.decode(result.value);
      const parsedData = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
      }).data;
      setData(parsedData);
    };
    fetchData();
  }, []);

  return (
    <div>
      <NavBar />
      <div style={{ backgroundColor: 'lightslategray', color: 'white', fontWeight: 'bold' }}>
        <BootstrapTable filter={filterFactory()} pagination={pagination} bootstrap4 keyField='id' columns={columns} data={data} />
      </div>
    </div>
  );
}
