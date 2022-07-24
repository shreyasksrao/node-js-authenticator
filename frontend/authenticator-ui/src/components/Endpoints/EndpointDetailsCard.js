import React, {useState, useEffect} from 'react';
import "./EndpointActions.css";

function EndpointDetailsCard({endpointId, endpoints}) {
  const [ eid, setId ] = useState('');
  const [ eName, setEName ] = useState('');
  const [ eMethod, setMethod] = useState('');
  const [ endpoint, setEndpoint ] = useState('');
  const [ eDescription, setDescription] = useState('');

  useEffect(() => {
    setId(endpointId);
    const thisEndpoint = endpoints.filter(endpoint => {
      return endpoint.id === endpointId;
    });
    setMethod(thisEndpoint[0].method);
    setEndpoint(thisEndpoint[0].endpoint)
    setEName(thisEndpoint[0].name);
    setDescription(thisEndpoint[0].description);
  }, []);

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
          <span>{eid}</span>
        </div>
        <div className="method">
          <span className='cardTitle'>Endpoint Method : </span>
          <div className="methodContainer" style={{backgroundColor: colorsMap[eMethod.toUpperCase()]}}>
            {eMethod}
          </div>
        </div>
      </div>
      <div className="name card-item">
        <span className='cardTitle'>Endpoint Name : </span>
        <span>{eName}</span>
      </div>
      <div className="endpoint card-item">
        <span className='cardTitle'>Endpoint : </span>
        <span>{endpoint}</span>
      </div>
      <div className="description card-item">
        <span className='cardTitle'>Description : </span>
        <span>{eDescription}</span>
      </div>
    </div>
  )
}

export default EndpointDetailsCard
