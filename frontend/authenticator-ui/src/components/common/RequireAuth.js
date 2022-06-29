import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../../services/AuthService';

function RequireAuth({ children, redirectTo }) {
    let isAuthenticated = isLoggedIn();
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

export default RequireAuth
