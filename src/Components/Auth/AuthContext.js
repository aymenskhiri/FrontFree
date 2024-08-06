import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [freelancerId, setFreelancerId] = useState(null);
    const [clientId, setClientId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const freelancerId = localStorage.getItem('freelancerId');
        const clientId = localStorage.getItem('client_id');

        if (token) {
            setIsAuthenticated(true);
            setRole(role);
            setFreelancerId(freelancerId);
            setClientId(clientId);
        } else {
            setIsAuthenticated(false);
            setRole(null);
            setFreelancerId(null);
            setClientId(null);
        }
    }, []);

    const login = (token, role, freelancerId = null, clientId = null) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        if (role === 'freelancer') {
            localStorage.setItem('freelancerId', freelancerId);
        } else if (role === 'client') {
            localStorage.setItem('client_id', clientId);
        }
        setIsAuthenticated(true);
        setRole(role);
        setFreelancerId(freelancerId);
        setClientId(clientId);

        if (role === 'freelancer') {
            navigate('/DashboardFreelancer');
        } else if (role === 'client') {
            navigate('/ClientView');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('freelancerId');
        localStorage.removeItem('client_id');
        setIsAuthenticated(false);
        setRole(null);
        setFreelancerId(null);
        setClientId(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, freelancerId, clientId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
