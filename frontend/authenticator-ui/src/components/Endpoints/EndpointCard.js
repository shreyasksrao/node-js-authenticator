import React from 'react';
import {BsCheckLg, BsFillExclamationTriangleFill} from 'react-icons/bs';

function EndpointCard({ id, name, description, method, endpoint, is_depricated, onEndpointClick }) {

  const getMethodBgColor = (method) => {
    let colorMap = {
        'GET': '#6f8dfd',
        'POST': '#33b816',
        'PUT': '#d7ad16',
        'DELETE': '#c00505'
    };
    return colorMap[method.toUpperCase()];
  };

  return (
    <div className='endpoint-card' onClick={() => onEndpointClick(id)}>
      <div className="endpoint-method" style={{backgroundColor: getMethodBgColor(method)}}>
            {method.toUpperCase()}
      </div>
      <div className='endpoint-name'>
            {name.length > 30 ? `${name.slice(0,28)}...`: name}
      </div>
      <div className='endpoint-endpoint'>  
            {endpoint}
      </div>
      <div className='endpoint-depricated'>
            { is_depricated === 'yes' ? 
              <BsFillExclamationTriangleFill style={{color: 'yellow'}} /> : 
              <BsCheckLg style={{color: 'green'}} />
            }
      </div>
     </div> 
 
  )
}

export default EndpointCard
