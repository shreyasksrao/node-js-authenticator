import React from 'react';
import "./EndpointActions.css";

function EndpointDetailsCard({endpointDetails}) {
  const colorsMap = {
    'GET': '#10a2f0',
    'POST': '#00c386',
    'PUT': '#ff763a',
    'DELETE': '#c50000'
  };

  return (
    <div className="endpointCard">
      <div className="idAndMethodContainer card-item">
        <div className="id">
          <span className='cardTitle'>Endpoint ID : </span>
          <span>{endpointDetails.id}</span>
        </div>
        <div className="method">
          <span className='cardTitle'>Endpoint Method : </span>
          <div className="methodContainer" style={{backgroundColor: colorsMap[endpointDetails.method.toUpperCase()]}}>
            {endpointDetails.method}
          </div>
        </div>
      </div>
      <div className="name card-item">
        <span className='cardTitle'>Endpoint Name : </span>
        <span>{endpointDetails.name}</span>
      </div>
      <div className="endpoint card-item">
        <span className='cardTitle'>Endpoint : </span>
        <span>{endpointDetails.endpoint}</span>
      </div>
      <div className="description card-item">
        <span className='cardTitle'>Description : </span>
        <span>{endpointDetails.description}</span>
      </div>
    </div>
  )
}

export default EndpointDetailsCard
