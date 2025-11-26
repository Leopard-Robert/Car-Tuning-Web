import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAdmin } = useAuth();
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default ProtectedRoute;