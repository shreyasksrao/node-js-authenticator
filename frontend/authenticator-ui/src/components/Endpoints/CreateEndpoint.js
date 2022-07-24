import React from 'react';
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
import { makeStyles } from "@material-ui/core/styles";

import EndpointNotification from './EndpointNotification';
import { createEndpoint } from '../../services/EndpointService';

const useStyles = makeStyles({
    select: {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--borderColor) !important',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'black !important',
      },
    },
  });
  
  const inputCustomStyles = {
    '& .MuiInputLabel-root': {
      color: 'white !important'
    },
    '& .MuiOutlinedInput-root': {
      border: '1px var(--borderColor) !important',
      color: 'rgba(254, 254, 254, 0.87)',
      "& > fieldset": { borderColor: "var(--borderColor)" },
      input: { color: 'white' }
    },
    "& .MuiFormHelperText-root": {
      color: '#7f7f7fab !important',
      fontSize: '10px'
    },
    '& .MuiSelect-select': {
      color: "white !important"
    },
    '& .MuiSelect-icon': {
      color: '#7f7f7fab'
    },
    '& .MuiPaper-root': {
      backgroundColor: 'blue'
    },
    '& .Mui-disabled': {
      backgroundColor: '#072921 !important',
      color: '#565656 !important'
    }
  }

function CreateEndpoint() {
    const [notifications, setNotifications] = React.useState([]);
    const [endpointName, setEndpointName] = React.useState('');
    const [endpoint, setEndpoint] = React.useState('');
    const [endpointDescription, setEndpointDescription] = React.useState('');
    const [method, setMethod] = React.useState('GET');

    const [endpointNameHelperText, setEndpointNameHelperText] = React.useState("'Name of the Endpoint'");
    const [endpointHelpertext, setEndpointHelpertext] = React.useState('REST Endpoint (Ex: "/api/v1/user/login")');

    const handleMethodChange = (event) => {
      setMethod(event.target.value);
    };

    const isEndpointNameValid = (endpointName) => {
      if(endpointName.length > 50 || endpointName.includes(' '))return false;
      return true;
    };

    React.useEffect(() => {
      if(endpointName.length > 50) setEndpointNameHelperText('Endpoint name should be less than 50 characters !');
      else if(endpointName.includes(' ')) setEndpointNameHelperText('Endpoint name should not contain white spaces. Use "_" as delimiter');
      else setEndpointNameHelperText('Name of the Endpoint');
    }, [endpointName]);

    const handleCreateEndpoint = async () => {
      if(endpointName === '')setNotifications(oldVal => [...oldVal, {severity: 'error', message: 'Endpoint name is required...'}]);
      else if(endpoint === '')setNotifications(oldVal => [...oldVal, {severity: 'error', message: 'Endpoint is required...'}]);
      else {
        let data = {
          name: endpointName,
          endpoint: endpoint,
          description: endpointDescription,
          method: method
        };
        let resData = await createEndpoint(data);
        console.log(resData);
        if(resData.returnCode === 0){
          setNotifications(oldVal => [...oldVal, {severity: 'success', message: resData.data.message}]);
          setEndpoint('');setEndpointName('');setEndpointDescription('');
        }
        if(resData.returnCode === -1)
          setNotifications(oldVal => [...oldVal, {severity: 'error', message: resData.error}]);
      }
    };

    const classes = useStyles();

  return (
    <div className="create-endpoint-container">
      <Box sx={{margin: '10px 0px 0px 20px'}}>
        <p style={{fontSize: '16px', fontWeight: 'bold', color: 'wheat', textAlign: 'left',  marginBottom: '0px'}}>CREATE ENDPOINT</p>
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
                    className={classes.textFieldRoot}
                    sx={inputCustomStyles}
                    id="outlined-helperText"
                    label="Endpoint Name"
                    helperText={endpointNameHelperText}
                    onChange={(newValue) => setEndpointName(newValue.target.value)}
                    error={!isEndpointNameValid(endpointName)}
                    fullWidth
                    autoFocus
                    required
                    InputLabelProps={{
                        style: {
                        color: '#b4bdc4'
                        } }}
                />
            </Box>
        </Grid>
        <Grid item md={12} lg={6}>
            <Box sx={{marginRight: '20px'}}>
                <TextField
                    sx={inputCustomStyles}
                    id="outlined-helperText"
                    label="Endpoint"
                    helperText="REST endpoint (Ex: '/api/v1/user/login')"
                    onChange={(newValue) => setEndpoint(newValue.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{
                        style: {
                        color: '#b4bdc4'
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
                    onChange={(newValue) => setEndpointDescription(newValue.target.value)}
                    multiline
                    fullWidth
                    rows={4}
                    sx={inputCustomStyles}
                    InputLabelProps={{
                        style: {
                        color: '#b4bdc4'
                        } }}
                />
            </Box>
        </Grid>

        <Grid item md={12} lg={6}>
            <Box sx={{width: '180px', maxWidth: '100%', marginLeft: '20px'}}>
                <FormControl required style={{minWidth: 120}}>
                <InputLabel id="endpoint-method-select-label">Method</InputLabel>
                <Select
                    className={classes.select}
                    labelId="endpoint-method-select-label"
                    id="endpoint-method-select"
                    value={method}
                    required
                    onChange={handleMethodChange}
                    label="Method"
                    sx={inputCustomStyles}
                    InputLabelProps={{
                    style: {
                        color: '#b4bdc4'
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
                    disabled={!isEndpointNameValid(endpointName)}
                    onClick={() => handleCreateEndpoint()}
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

export default CreateEndpoint
