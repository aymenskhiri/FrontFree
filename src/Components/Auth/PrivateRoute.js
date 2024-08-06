import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ element: Element }) => {
    const isAuthenticated = !!localStorage.getItem('token'); 
    const role = localStorage.getItem('role'); 
    const location = useLocation();

    console.log('PrivateRoute:', { isAuthenticated, role, pathname: location.pathname });

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role === 'freelancer') {
        if (!['/DashboardFreelancer', '/MyPosts', '/DemandList', '/MyServices'].includes(location.pathname)) {
            console.log('Redirecting to /DashboardFreelancer');
            return <Navigate to="/DashboardFreelancer" replace />;
        }
    } else if (role === 'client') {
        if (!['/ClientView', '/PostList', '/CreateDemand','/MyDemands'].includes(location.pathname)) {
            console.log('Redirecting to /ClientView');
            return <Navigate to="/ClientView" replace />;
        }
    }

    return Element;
};

export default PrivateRoute;
