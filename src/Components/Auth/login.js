import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FormGroup, FormControl, InputLabel, Input, Button, FormHelperText, makeStyles, IconButton, InputAdornment } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles((theme) => ({
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: theme.spacing(2),
    },
    form: {
        width: '100%', 
        maxWidth: '400px', 
    },
    submitButton: {
        marginTop: theme.spacing(5), 
    },
}));

const Login = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://laraproject.test/api/login', data);
            console.log('API Response:', response.data);
    
            const { token, client_id, freelancer_id, user } = response.data;
            const role = user?.role;
    
            console.log(`Role: ${role}`);
            console.log(`Freelancer ID: ${freelancer_id}`);
            console.log(`Client ID: ${client_id}`);
    
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            if (role === 'freelancer') {
                localStorage.setItem('freelancerId', freelancer_id);
                localStorage.removeItem('client_id');
            } else if (role === 'client') {
                localStorage.setItem('client_id', client_id);
                localStorage.removeItem('freelancerId');
            }
    
            setTimeout(() => {
                window.location.reload();
            }, 100);
            console.log('Stored Role:', localStorage.getItem('role'));
    
            if (role === 'freelancer') {
                navigate('/DashboardFreelancer');
            } else if (role === 'client') {
                navigate('/ClientView');
            } else {
                console.error('Unknown role:', role);
            }
    
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.error;
                setError('api', {
                    type: 'server',
                    message: errorMessage
                });
            }
        }
    };
    
    return (
        <div className={classes.formContainer}>
            <div>
                <h2>Login</h2>
                <br />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
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

                    {errors.api && <FormHelperText error>{errors.api.message}</FormHelperText>}

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
