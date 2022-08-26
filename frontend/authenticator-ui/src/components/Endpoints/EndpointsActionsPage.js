import React from 'react';
import {useNavigate} from 'react-router-dom';
import { Routes, Route} from 'react-router-dom';

import { getAllEndpoints } from '../../services/EndpointService';
import RequireAuth from '../common/RequireAuth';
import EndpointActionsToolBar from './EndpointActionsToolBar';
import ListEndpoint from './ListEndpoint';
import CreateEndpoint from './CreateEndpoint';
import EditEndpoint from './EditEndpoint';


function EndpointsActionsPage({ isSidebarOpen }) {
  const navigate = useNavigate();
  const [allEndpoints, setAllEndpoints] = React.useState([]);
  const [selectedEndpointIds, setSelectedEndpointIds] = React.useState([]);

  const [isAddButtonDisabled, setIsAddButtonDisabled] = React.useState(false);
  const [isEditButtonDisabled, setIsEditButtonDisabled] = React.useState(false);
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = React.useState(false);

  React.useEffect(() => {
    const _getAllEndpoints = async () => {
      let data = await getAllEndpoints();
      if (data.returnCode === -2)
        navigate('/signin');
      else if (data.returnCode === -1)
        navigate('/error');
      else{}
        setAllEndpoints(JSON.parse(data.data.endpoints));        
    };
    console.log('Fetching Endpoints...');
    _getAllEndpoints();
  }, []);

  return (
    <> 
      <div className='endpoint-nav-bar'
        style={{
          width: isSidebarOpen ? 'calc(100% - var(--sidePanelWidth))': '100%'
        }}
      >
        <EndpointActionsToolBar 
          isAddButtonDisabled={isAddButtonDisabled} 
          isEditButtonDisabled={isEditButtonDisabled} 
          isDeleteButtonDisabled={isDeleteButtonDisabled} 
        />
      </div>
      <div className='endpoint-content'>
      <Routes>
        <Route path="/" element={
          <ListEndpoint 
            allEndpoints={allEndpoints} 
            detailsEndpointIds={selectedEndpointIds} 
            setDetailsEndpointIds={setSelectedEndpointIds} 

            setIsAddButtonDisabled={setIsAddButtonDisabled} 
            setIsEditButtonDisabled={setIsEditButtonDisabled} 
            setIsDeleteButtonDisabled={setIsDeleteButtonDisabled} 
          />
        }/>
        <Route path="/create" element={
          <RequireAuth redirectTo="/login" redirectState={{redirectTo: "/endpointActions/create"}}>
            <CreateEndpoint 
              setIsAddButtonDisabled={setIsAddButtonDisabled} 
              setIsEditButtonDisabled={setIsEditButtonDisabled} 
              setIsDeleteButtonDisabled={setIsDeleteButtonDisabled} 
            />
          </RequireAuth>
        }/> 

        <Route path="/edit" element={
          <RequireAuth redirectTo="/login" redirectState={{redirectTo: "/endpointActions/edit"}}>
            <EditEndpoint 
              endpointId={selectedEndpointIds.length > 0 ? selectedEndpointIds[0].id: ''}
              setIsAddButtonDisabled={setIsAddButtonDisabled} 
              setIsEditButtonDisabled={setIsEditButtonDisabled} 
              setIsDeleteButtonDisabled={setIsDeleteButtonDisabled} 
            />
          </RequireAuth>
        }/> 
        <Route path="*" element={
          <main style={{ padding: "1rem" }}>
            <p>There's nothing here!</p>
          </main>
        }/>
      </Routes>
      </div>  
    </>
  )
}

export default EndpointsActionsPage
