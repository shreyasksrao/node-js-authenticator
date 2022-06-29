import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { getAllEndpoints } from '../../services/EndpointService';
import styled from "styled-components";
import clsx from 'clsx';
import DataTable from '../DataTable/DataTable';
import EndpointMethod from './EndpointMethod';

function EndpointsActionsPage() {
  const navigate = useNavigate();
  const [allEndpoints, setAllEndpoints] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [detailsEndpointIds, setDetailsEndpointIds] = useState('');

  const columns = [
    { 
      field: 'id', 
      width: 300,
      headerName: 'ID'
    },
    { 
      field: 'method', 
      width: 200,
      headerName: 'Method',
      renderCell: ( params ) => <EndpointMethod method={params.value} />
    },
    { 
      field: 'name', 
      width: 300,
      headerName: 'Name'
    },
    { 
      field: 'endpoint',
      width: 400,
      headerName: 'Endpoint'
    },
  ];

  useEffect(() => {
    console.log('Fetching Endpoints...');
    _getAllEndpoints().then((resData) => setAllEndpoints(JSON.parse(resData.endpoints)));
  }, []);

  useEffect(() => {
    let mappedData = allEndpoints.map(endpoint => {
      return {
        'id': endpoint.id,
        'method': endpoint.method,
        'name': endpoint.name,
        'endpoint': endpoint.endpoint
      }
    });
    setTableData(mappedData);
    console.log('Creating Map of Endpoints...');
  }, [allEndpoints]);

  const _getAllEndpoints = async () => {
    let data = await getAllEndpoints();
    if (data.returnCode === -2)
        navigate('/login');
    else if (data.returnCode === -1)
        navigate('/error');
    else
        return data.data;        
  };

  return (
    <> 
      <div className='list-endpoints-wrapper'>
        <DataTable columns={ columns } rows= { tableData } setSelectedRows={setDetailsEndpointIds}/>
      </div>
      <div className="endpoint-details-wrapper">
        <div className='endpoint-details-container'>
            {
              <pre style={{ fontSize: 10 }}>
                {JSON.stringify(detailsEndpointIds, null, 4)}
              </pre>
            }
        </div>
      </div>
    </>
  )
}

export default EndpointsActionsPage
