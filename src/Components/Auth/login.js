import React, { useState } from 'react';
import { useForm } from 'react-hook-form'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FormGroup, FormControl, InputLabel, Input, Button, makeStyles, FormHelperText , IconButton, InputAdornment} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles((theme) => ({
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(2),
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',  // Adding shadow to the form container
      borderRadius: '8px',  // Adding border radius for rounded corners
      backgroundColor: '#fff', // White background for the form container
    },
    form: {
        width: '100%',
        maxWidth: '400px',
        padding: theme.spacing(4), // Added padding to the form
        borderRadius: '8px', // Rounded corners for the form
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Shadow for the form
        border: '1px solid #B0B0B0', 
        position: 'relative', // Positioning for the shadow effect
        overflow: 'hidden', // Ensures that the rounded corners work with the border
      },
      
      titleContainer: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%', // Make sure it takes the full width of the form
    },
    submitButton: {
      marginTop: theme.spacing(3),
      padding: theme.spacing(1.5),
      fontWeight: 'bold',
      backgroundColor: '#4CAF50', // Green color
      color: '#fff',
      '&:hover': {
        backgroundColor: '#C79400', // Darker gold shade for hover
      },
    },
  }));
  

const Login = () => {
    const classes = useStyles();
    const navigate = useNavigate(); 
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://laraproject.test/api/login', data);
            console.log(response.data);

            const { role, client_id, freelancer_id } = response.data.user;
            const token = response.data.token;
            localStorage.setItem('role', role);
      
            let ss= await axios.get("http://laraproject.test/api/csrf-token")
            localStorage.setItem("csrfToken",ss.data.csrf_token)
            console.log(ss.data.csrf_token)

            localStorage.setItem('token', token);
      
            if (role === 'freelancer') {
                localStorage.setItem('freelancer_id', response.data.freelancer_id); // consistent naming
                navigate('/DashboardFreelancer');
            } else if (role === 'client') {
                localStorage.setItem('client_id', response.data.client_id); // consistent naming
                navigate('/ClientView');
            }
            else if (role === 'admin') {
                navigate('/UserTable'); 
            }
            setTimeout(() => {
                window.location.reload();
            }, 50); 
      
          } catch (error) {
            console.error('Login error:', error.response.data);
          }
    };

    return (
        <div className={classes.formContainer}>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <div className={classes.titleContainer}>
                    <h2>Login</h2> {/* Title is now centered above the form */}
                </div>
            <FormGroup>
            <FormControl>
                        <InputLabel htmlFor="email">Email*</InputLabel>
                        <Input
                            id="email"
                            type="text"
                            {...register('email', { 
                                required: 'Email is required', 
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Please include an "@" in the email address.'
                                }
                            })}
                        />
                        {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
                    </FormControl>

                <FormControl>
                    <InputLabel htmlFor="password">Password*</InputLabel>
                    <Input
                        id="password"
                            type={showPassword ? 'text' : 'password'}
                        {...register('password', { required: 'Password is required' })}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
                </FormControl>

                <Button type="submit" variant="contained" color="primary" className={classes.submitButton}>Login</Button>
            </FormGroup>
            </form>
            <div className="register-link">
            <p>Don't have an account? <Link to="/register">Register</Link></p>
          </div>
        </div>
    );
};

export default Login;