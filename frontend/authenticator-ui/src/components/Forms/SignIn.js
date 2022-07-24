import React, {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import "./SignIn.css";

import {InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import {useNavigate, useLocation} from 'react-router-dom';
import {loginHandler} from '../../services/UserService'; 

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" className="copy-right-text" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://f2ktech.com/">
        F2K Tech
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignIn() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get('email');
    const password = data.get('password');
    let response = await loginHandler(email, password);
    if(response.success){
      if (location.state === null)
          navigate('/');
      navigate(location.state.redirectTo);
    }      
    else{
        console.log(response);
        navigate('/login');
    }    
  };

  /*
    conatiner bg: #1a1d20
  */


  return (
    // <ThemeProvider theme={darkTheme}>
      <Container className='signin-container' component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar className="signin-avatar" sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              InputLabelProps={{
                style: {
                  color: '#b4bdc4'
                } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                "& > fieldset": { borderColor: "var(--borderColor)" },
                input: { color: 'white' }
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              InputLabelProps={{
                style: {
                  color: '#b4bdc4'
                } }}
                InputProps={{ // <-- This is where the toggle button is added.
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility style={{ color: '#b4bdc4' }} /> : <VisibilityOff style={{ color: '#b4bdc4' }} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              sx={{
                "& .MuiOutlinedInput-root": {
                "& > fieldset": { borderColor: "var(--borderColor)" },
                input: { color: 'white' }
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{backgroundColor: "#06529c"}}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    // </ThemeProvider>
  );
}