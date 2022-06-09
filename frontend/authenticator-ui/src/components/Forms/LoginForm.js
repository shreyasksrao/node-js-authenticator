import React from 'react'
import FormInput from '../common/FormInput';

export default function LoginForm() {
  return (
    <div className='login-form'>
      <div className='login-logo'>
        <img className='logo-image' alt='app-logo' src='/logo.png'/>
        <h1>Sign In</h1>
      </div>
      <FormInput inputId="email" inputType='text' labelValue='Email Address'/>
      <FormInput inputId="pwd" inputType='password' labelValue='Password'/>
      <button className='btn btn-primary'>LOG IN</button>
    </div>
  )
}
