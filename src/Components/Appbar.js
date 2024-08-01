import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import axios from 'axios';

export default function Appbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [auth, setAuth] = React.useState(false);
  const [role, setRole] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    
    if (token) {
      setAuth(true);
      setRole(userRole);
    } else {
      setAuth(false);
      setRole(null);
    }

    if (!localStorage.getItem('csrfToken')) {
      const fetchCsrfToken = async () => {
        try {
          const response = await axios.get('http://laraproject.test/api/csrf-token');
          if (response.data && response.data.csrf_token) {
            localStorage.setItem('csrfToken', response.data.csrf_token);
          } else {
            console.error('CSRF token not found in response');
          }
        } catch (error) {
          console.error('Error fetching CSRF token:', error);
        }
      };

      fetchCsrfToken();
    }
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      await axios.post('http://laraproject.test/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('freelancerId');
      localStorage.removeItem('client_id');
      localStorage.removeItem('csrfToken');

      setAuth(false);
      setRole(null);

      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error.response ? error.response.data : error.message);
    } finally {
      handleClose();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MyApp
          </Typography>
          {!auth && (
            <>
              <Button color="inherit" component={Link} to="/register">Register</Button>
              <Button color="inherit" component={Link} to="/login">Login</Button>
            </>
          )}
          {auth && (
            <>
              {role === 'client' && (
                <Button color="inherit" component={Link} to="/ClientView">ClientView</Button>
              )}
              {role === 'freelancer' && (
                <Button color="inherit" component={Link} to="/DashboardFreelancer">DashboardFreelancer</Button>
              )}
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>My Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
