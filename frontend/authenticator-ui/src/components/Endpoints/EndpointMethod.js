import React from 'react';
import styled from 'styled-components';

function EndpointMethod({ method }) {
  const colorsMap = {
    'GET': '#10a2f0',
    'POST': '#00c386',
    'PUT': '#ff763a',
    'DELETE': '#c50000'
  };

  const StyledDiv = styled.div`
    background-color: ${colorsMap[method]};
    border-radius: 10px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70%;
    width: 95%;
  `;
  return (
    <StyledDiv>
        {method}
    </StyledDiv>
  )
}

export default EndpointMethod
