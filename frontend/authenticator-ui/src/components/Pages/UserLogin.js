import React, {useState} from 'react'
import {useNavigate, useLocation} from 'react-router-dom';
import FormInput from '../common/FormInput';

import {loginHandler} from '../../services/UserService'; 

export default function UserLogin() {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const location = useLocation();

    const navigate = useNavigate();

    const onLoginBtnClick = async (event) => {
        let response = await loginHandler(loginEmail, loginPassword);
        if(response.success){
            if (location.state === null)
                navigate('/');
            console.log(`Moving to ${location.state.redirectTo} page`);
            navigate(location.state.redirectTo);
            console.log(`Moved to ${location.state.redirectTo} page`);
        }      
        else{
            console.log(response);
            navigate('/login');
        }    
    };
    const handleEmailInputChange = (event) => {
        setLoginEmail(event.target.value);
    };
    const handlePasswordInputChange = (event) => {
        setLoginPassword(event.target.value);
    };
    return (
        <div className='login-wrapper'>
            <div className='login-container'>
                <div className='login-actions'>
                    Left hand side
                </div>
                <div className='login-form'>
                    <div className='login-logo'>
                        <img className='logo-image' alt='app-logo' src='/logo.png'/>
                        <h1>Sign In</h1>
                    </div>
                    <FormInput inputId="email" inputType='text' labelValue='Email Address' onChangeHandler={handleEmailInputChange}/>
                    <FormInput inputId="pwd" inputType='password' labelValue='Password' onChangeHandler={handlePasswordInputChange}/>
                    <button className='btn btn-primary' onClick={onLoginBtnClick}>LOG IN</button>
                </div>
            </div>
        </div>
    )
}
