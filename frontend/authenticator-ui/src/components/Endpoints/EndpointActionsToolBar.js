import React from 'react';
import { Link } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

function EndpointActionsToolBar() {
  return (
    <>
     <div>
      <Tooltip title="Add"> 
        <IconButton aria-label="add endpoint" 
          component={Link} to="/endpointActions/create"
          sx={{
            color: 'white',
            borderRadius: 0,
            backgroundColor: '#1e3715',
            marginRight: '5px',
            marginLeft: '5px'
          }}>
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton aria-label="edit endpoint" 
            sx={{
              color: 'white',  
              borderRadius: 0,
              backgroundColor: '#8f440d',
              marginRight: '5px'
            }}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton aria-label="delete endpoint" 
            sx={{
              color: 'white',
              borderRadius: 0,
              backgroundColor: '#7c2424',
              marginRight: '5px'
            }}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
     </div>
     <div></div>
    </>
  )
}

export default EndpointActionsToolBar;
