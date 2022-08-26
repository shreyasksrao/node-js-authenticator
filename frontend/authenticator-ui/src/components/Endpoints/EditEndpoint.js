import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import EndpointNotification from './EndpointNotification';
import { getEndpoint } from '../../services/EndpointService';

function EditEndpoint({ endpointId, setIsAddButtonDisabled, setIsEditButtonDisabled, setIsDeleteButtonDisabled, theme }) {

  const navigate = useNavigate();

  const [notifications, setNotifications] = React.useState([]);
  const [id, setId] = React.useState('');
  const [name, setName] = React.useState('');
  const [endpoint, setEndpoint] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [method, setMethod] = React.useState('');

  const [endpointNameHelperText, setEndpointNameHelperText] = React.useState("'Name of the Endpoint'");
  
  const inputCustomStyles = {
    '& .MuiInputLabel-root': {
      color: theme === 'dark' ? 'white !important': 'black !important'
    },
    '& .MuiOutlinedInput-root': {
      border: '1px var(--borderColor) !important',
      color: theme === 'dark' ? 'rgba(254, 254, 254, 0.87)': 'black',
      "& > fieldset": { borderColor: "var(--borderColor) !important" },
      input: { color: theme === 'dark' ? 'white': 'black' }
    },
    "& .MuiFormHelperText-root": {
      color: '#7f7f7fab !important',
      fontSize: '10px'
    },
    '& .MuiSelect-select': {
      color: theme === 'dark' ? "white !important": 'black !important'
    },
    '& .MuiSelect-icon': {
      color: '#7f7f7fab'
    },
    '& .MuiPaper-root': {
      backgroundColor: 'blue'
    },
    '& .Mui-disabled': {
      color: '#565656 !important',
      WebkitTextFillColor: '#565656 !important'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme === 'dark' ? 'var(--borderColor) !important' : 'black !important',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'black !important',
    },
  }

  React.useEffect(() => {
    const _getEndpointDetails = async (id) => {
        let data = await getEndpoint(id);
        if (data.returnCode === -2)
            navigate('/signin');
        else if (data.returnCode === -1)
            navigate('/error');
        else{
            let jsonParsedData = JSON.parse(data.data.endpoint);
            setId(jsonParsedData.id);
            setMethod(jsonParsedData.method);
            setName(jsonParsedData.name);
            setEndpoint(jsonParsedData.endpoint);
            setDescription(jsonParsedData.description);
        }
    };

    setIsAddButtonDisabled(true);
    setIsEditButtonDisabled(true);
    setIsDeleteButtonDisabled(false);

    _getEndpointDetails(endpointId);
  }, []);

  React.useEffect(() => {
    if(name.length > 50) setEndpointNameHelperText('Endpoint name should be less than 50 characters !');
    else if(name.includes(' ')) setEndpointNameHelperText('Endpoint name should not contain white spaces. Use "_" as delimiter');
    else setEndpointNameHelperText('Name of the Endpoint');
  }, [name]);

  const handleMethodChange = (event) => {
    setMethod(event.target.value);
  };

  const isEndpointNameValid = (_name) => {
    if(_name.length > 50 || _name.includes(' '))return false;
    return true;
  };

  const handleEditEndpoint = () => {

  };

  return (
    <div className="create-endpoint-container">
      <Box sx={{margin: '10px 0px 0px 20px'}}>
        <p style={{fontSize: '16px', fontWeight: 'bold', color: 'wheat', textAlign: 'left',  marginBottom: '0px'}}>EDIT ENDPOINT</p>
      </Box>

      <Box 
        sx={{
            maxWidth: '100%', 
            margin: '20px', 
            maxHeight: '200px',
            mb: 2,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
        }}>
        {notifications.map(notification => <EndpointNotification severity={notification.severity} message={notification.message} /> )}
      </Box>

      <Grid container columnSpacing={2} rowSpacing={2}>
      <Grid item md={12} lg={6} >
            <Box sx={{ marginLeft: '20px'}}>
                <TextField
                    sx={inputCustomStyles}
                    id="outlined-helperText"
                    label="Endpoint ID"
                    value={id}
                    disabled
                    fullWidth
                    autoFocus
                    required
                    InputLabelProps={{
                        style: {
                        color: theme === 'dark' ? '#b4bdc4': 'black'
                        } }}
                />
            </Box>
        </Grid>
        <Grid item md={12} lg={6} >
            <Box sx={{ marginLeft: '20px', marginRight: '20px'}}>
                <TextField
                    sx={inputCustomStyles}
                    id="outlined-helperText"
                    label="Endpoint Name"
                    helperText={endpointNameHelperText}
                    value={name}
                    onChange={(newValue) => setName(newValue.target.value)}
                    error={!isEndpointNameValid(name)}
                    fullWidth
                    autoFocus
                    required
                    InputLabelProps={{
                        style: {
                        color: theme === 'dark' ? '#b4bdc4': 'black'
                        } }}
                />
            </Box>
        </Grid>
        <Grid item md={12} lg={12}>
            <Box sx={{marginLeft: '20px', marginRight: '20px'}}>
                <TextField
                    sx={inputCustomStyles}
                    id="outlined-helperText"
                    label="Endpoint"
                    helperText="REST endpoint (Ex: '/api/v1/user/login')"
                    value={endpoint}
                    onChange={(newValue) => setEndpoint(newValue.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{
                        style: {
                        color: theme === 'dark' ? '#b4bdc4': 'black'
                        } }}
                />
            </Box>
        </Grid>
        
        <Grid item lg={12}>
            <Box sx={{ marginLeft: '20px', marginRight: '20px'}}>
                <TextField
                    id="endpoint-description"
                    label="Endpoint Description"
                    helperText="Description about the endpoint"
                    value={description}
                    onChange={(newValue) => setDescription(newValue.target.value)}
                    multiline
                    fullWidth
                    rows={4}
                    sx={inputCustomStyles}
                    InputLabelProps={{
                        style: {
                        color: theme === 'dark' ? '#b4bdc4': 'black'
                      }
                    }}
                />
            </Box>
        </Grid>

        <Grid item md={12} lg={6}>
            <Box sx={{width: '180px', maxWidth: '100%', marginLeft: '20px'}}>
                <FormControl required style={{minWidth: 120}}>
                <InputLabel id="endpoint-method-select-label"
                  sx={{color: theme === 'dark' ? '#b4bdc4 !important': 'black !important'}}
                >
                  Method
                </InputLabel>
                <Select
                    labelId="endpoint-method-select-label"
                    id="endpoint-method-select"
                    value={method}
                    required
                    onChange={handleMethodChange}
                    label="Method"
                    sx={inputCustomStyles}
                    InputLabelProps={{
                    style: {
                        color: theme === 'dark' ? '#b4bdc4 !important': 'black !important'
                    } 
                    }}
                >
                    <MenuItem value={"GET"}>GET</MenuItem>
                    <MenuItem value={"POST"}>POST</MenuItem>
                    <MenuItem value={"PUT"}>PUT</MenuItem>
                    <MenuItem value={"DELETE"}>DELETE</MenuItem>
                </Select>
                <FormHelperText style={{color: '#7f7f7fab'}}>HTTP method of the endpoint</FormHelperText>
                </FormControl>
            </Box>
        </Grid>
        </Grid>

        <Box sx={{display: 'flex', margin: '22px'}}>
        <Button variant="contained" endIcon={<LocalOfferIcon />}>
            Add Tags
        </Button>
        </Box>

        <Box
            sx={{
                marginLeft: 'auto',
                borderTop: '1px solid var(--borderColor)'
            }}
        >
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'end'}}>
                <Button 
                    variant="contained"
                    disabled={!isEndpointNameValid(name)}
                    onClick={() => handleEditEndpoint()}
                    sx={{
                        backgroundColor: '#1e3715',
                        color: 'white',
                        margin: '20px'
                    }}
                >
                    CREATE
                </Button>
                <Button 
                    variant="contained"
                    onClick={() => navigate('/endpointActions')}
                    sx={{
                        backgroundColor: '#000',
                        color: 'white',
                        margin: '20px'
                    }}
                >
                    CANCEL
                </Button>
            </Box>
        </Box>
    </div>
  )
}

export default EditEndpoint

EditEndpoint.propTypes = {
  theme: PropTypes.string,
}
EditEndpoint.defaultProps = {
  theme: 'light'
}