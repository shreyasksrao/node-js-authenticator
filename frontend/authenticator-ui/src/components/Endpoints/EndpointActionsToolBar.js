import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { styled, alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function EndpointActionsToolBar({ isAddButtonDisabled, isEditButtonDisabled, isDeleteButtonDisabled }) {
  let navigate = useNavigate();

  return (
    <>
     <div className='toolbar-container'>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <Tooltip title="Back"> 
          <IconButton aria-label="add endpoint" 
            onClick={() => navigate(-1)}
            sx={{
              color: 'white',
              borderRadius: '50%',
              backgroundColor: '#363636',
              marginRight: '5px',
              marginLeft: '5px',
              '&.Mui-disabled': {
                backgroundColor: '#2c3a28 !important',
                color: '#687070 !important'
              },
              ':hover': {
                backgroundColor: '#737373 !important',
                color: 'white !important',
              },
            }}>
              <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="List Endpoints"> 
          <IconButton aria-label="list endpoint" 
            onClick={() => navigate('/endpointActions')}
            sx={{
              color: 'white',
              borderRadius: 0,
              backgroundColor: '#043695ba',
              marginRight: '0px',
              marginLeft: '5px',
              '&.Mui-disabled': {
                backgroundColor: '#273858 !important',
                color: '#687070 !important'
              },
              ':hover': {
                backgroundColor: '#347affba !important',
                color: 'white !important',
              },
            }}>
              <FormatListBulletedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add"> 
          <IconButton aria-label="add endpoint" 
            component={Link} to="/endpointActions/create"
            disabled={isAddButtonDisabled}
            sx={{
              color: 'white',
              borderRadius: 0,
              backgroundColor: '#254a18',
              marginRight: '5px',
              marginLeft: '5px',
              '&.Mui-disabled': {
                backgroundColor: '#2c3a28 !important',
                color: '#687070 !important'
              },
              ':hover': {
                backgroundColor: '#226e06 !important',
                color: 'white !important',
              },
            }}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton aria-label="edit endpoint" 
              disabled={isEditButtonDisabled}
              component={Link} to="/endpointActions/edit"
              sx={{
                color: 'white',  
                borderRadius: 0,
                backgroundColor: '#8f440d',
                marginRight: '5px',
                '&.Mui-disabled': {
                  backgroundColor: '#694e41ba !important',
                  color: '#687070 !important'
                },
                ':hover': {
                  backgroundColor: '#e34a00 !important',
                  color: 'white !important',
                },
              }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton aria-label="delete endpoint" 
              disabled={isDeleteButtonDisabled}
              sx={{
                color: 'white',
                borderRadius: 0,
                backgroundColor: '#7c2424',
                marginRight: '5px',
                '&.Mui-disabled': {
                  backgroundColor: '#603737 !important',
                  color: '#687070 !important'
                },
                ':hover': {
                  backgroundColor: '#b30505 !important',
                  color: 'white !important',
                },
              }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
      </div>
      <div>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
      </div>
     </div>
    </>
  )
}

EndpointActionsToolBar.defaultProps = {
  isAddButtonDisabled: false,
  isEditButtonDisabled: false,
  isDeleteButtonDisabled: false
};

export default EndpointActionsToolBar;
