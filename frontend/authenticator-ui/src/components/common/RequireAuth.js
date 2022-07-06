import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../../services/AuthService';

function RequireAuth({ children, redirectTo, redirectState }) {
    const navigate = useNavigate();
    let isAuthenticated = isLoggedIn();
    return isAuthenticated ? children : navigate(redirectTo, {state: redirectState});
}

export default RequireAuth
