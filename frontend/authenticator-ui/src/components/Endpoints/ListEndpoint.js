import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { getAllEndpoints } from '../../services/EndpointService';
import DataTable from '../DataTable/DataTable';
import EndpointMethod from './EndpointMethod';
import CellTooltip from '../DataTable/CellTooltip';
import EndpointDetailsCard from './EndpointDetailsCard';
import Tooltip from '@mui/material/Tooltip';


function ListEndpoint() {
  const navigate = useNavigate();
  const [allEndpoints, setAllEndpoints] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [detailsEndpointIds, setDetailsEndpointIds] = useState([]);
  const columns = [
    { 
      field: 'id', 
      width: 200,
      headerName: 'ID',
      renderCell: (params) =>  <CellTooltip tooltipTitle={params.value} cellValue={params.value} />,
    },
    { 
      field: 'method', 
      width: 150,
      headerName: 'Method',
      renderCell: ( params ) => <EndpointMethod method={params.value} />
    },
    { 
      field: 'name', 
      width: 300,
      headerName: 'Name',
      renderCell: (params) =>  (
        <Tooltip title={params.value} >
          <span className="table-cell-trucate" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{params.value}</span>
        </Tooltip>
       ),
    },
    { 
      field: 'endpoint',
      width: 300,
      headerName: 'Endpoint',
      renderCell: (params) =>  (
        <Tooltip title={params.value} >
          <span className="table-cell-trucate" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{params.value}</span>
        </Tooltip>
       ),
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
        navigate('/signin');
    else if (data.returnCode === -1)
        navigate('/error');
    else
        return data.data;        
  };

  return (
    <> 
        <div className='list-endpoints-wrapper'>
            <div className='section-heading'>
            <h4 style={{color: 'wheat', textAlign: 'left', paddingLeft: '10px', paddingBottom: '5px', fontWeight: 'bold'}}>ENDPOINT LIST</h4>
            </div>
            <DataTable height={'350px'} columns={ columns } rows= { tableData } setSelectedRows={setDetailsEndpointIds}/>
        </div>
        <div className="endpoint-details-wrapper">
            <div className='section-heading'>
            <h4 style={{color: 'wheat', textAlign: 'left', paddingLeft: '10px', paddingBottom: '5px', fontWeight: 'bold'}}>ENDPOINT DETAILS</h4>
            </div>
            <div className='endpoint-details-container'>
                {
                detailsEndpointIds.map(tableRow => 
                    <EndpointDetailsCard key={tableRow.id} endpointId={tableRow.id} endpoints={allEndpoints} />
                )
                }
            </div>
        </div>
    </>
  )
}

export default ListEndpoint;
