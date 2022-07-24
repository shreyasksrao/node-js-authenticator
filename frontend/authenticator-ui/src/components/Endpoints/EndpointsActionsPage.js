import React from 'react';
import { Routes, Route} from 'react-router-dom';

import RequireAuth from '../common/RequireAuth';
import EndpointActionsToolBar from './EndpointActionsToolBar';
import ListEndpoint from './ListEndpoint';
import CreateEndpoint from './CreateEndpoint';


function EndpointsActionsPage() {
  return (
    <> 
      <div className='endpoint-nav-bar'>
        <EndpointActionsToolBar />
      </div>
      <div className='endpoint-content'>
      <Routes>
        <Route path="/" element={
          <ListEndpoint />
        }/>
        <Route path="/create" element={
          <RequireAuth redirectTo="/login" redirectState={{redirectTo: "/endpointActions/create"}}>
            <CreateEndpoint />
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
