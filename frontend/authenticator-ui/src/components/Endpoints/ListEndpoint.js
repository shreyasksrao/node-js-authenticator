import React from 'react';
import DataTable from '../DataTable/DataTable';
import EndpointMethod from './EndpointMethod';
import CellTooltip from '../DataTable/CellTooltip';
import EndpointDetailsCard from './EndpointDetailsCard';
import Tooltip from '@mui/material/Tooltip';

function ListEndpoint({ 
    allEndpoints, 
    detailsEndpointIds, 
    setDetailsEndpointIds, 
    setIsAddButtonDisabled, 
    setIsEditButtonDisabled,
    setIsDeleteButtonDisabled 
  }) {
  // Column Definition
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

  React.useEffect(() => {
    setIsEditButtonDisabled(true);
    setIsAddButtonDisabled(false);
    setIsDeleteButtonDisabled(true);

    return setDetailsEndpointIds([]);
  }, []);

  React.useEffect(() => {
    if(detailsEndpointIds.length === 0){
      setIsEditButtonDisabled(true);
      setIsAddButtonDisabled(false);
      setIsDeleteButtonDisabled(true);
    }
    else if(detailsEndpointIds.length === 1){
      setIsEditButtonDisabled(false);
      setIsAddButtonDisabled(false);
      setIsDeleteButtonDisabled(false);
    }
    else{
      setIsEditButtonDisabled(true);
      setIsAddButtonDisabled(false);
      setIsDeleteButtonDisabled(false);
    }
  }, [detailsEndpointIds]);

  const getTableData = () => {
    console.log('Creating Map of Endpoints...');
    let mappedData = allEndpoints.map(endpoint => {
      return {
        'id': endpoint.id,
        'method': endpoint.method,
        'name': endpoint.name,
        'endpoint': endpoint.endpoint
      }
    });
    return mappedData;
  };

  const getEndpointDetails = (endpointId) => {
    let filteredEndpoints = allEndpoints.filter(endpoint => {
      return endpoint.id === endpointId;
    });
    return {
      id: endpointId,
      name: filteredEndpoints[0].name,
      endpoint: filteredEndpoints[0].endpoint,
      method: filteredEndpoints[0].method,
      description: filteredEndpoints[0].description,
    }
  };

  return (
    <> 
        <div className='list-endpoints-wrapper'>
            <div className='section-heading'>
              <h4 style={{
                  color: 'wheat', 
                  textAlign: 'left', 
                  paddingLeft: '10px', 
                  paddingBottom: '5px', 
                  margin: '5px 0px', 
                  fontSize: '18px', 
                  fontWeight: 'bold'
                }}
              >
                ENDPOINT LIST
              </h4>
            </div>
            <DataTable height={'350px'} columns={ columns } rows= { getTableData() } setSelectedRows={setDetailsEndpointIds}/>
        </div>
        <div className="endpoint-details-wrapper">
            <div className='section-heading'>
              <h4 style={{
                  color: 'wheat', 
                  textAlign: 'left', 
                  paddingLeft: '10px', 
                  paddingBottom: '5px', 
                  margin: '5px 0px', 
                  fontSize: '18px', 
                  fontWeight: 'bold'
                }}
              >
                ENDPOINT DETAILS
              </h4>
            </div>
            <div className='endpoint-details-container'>
                {
                detailsEndpointIds.map(tableRow => 
                    <EndpointDetailsCard key={tableRow.id} endpointDetails={getEndpointDetails(tableRow.id)} />
                )
                }
            </div>
        </div>
    </>
  )
}

export default ListEndpoint;
