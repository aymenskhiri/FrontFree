import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FormGroup, FormControl, InputLabel, Input, Select, MenuItem, Button, FormHelperText, makeStyles, IconButton, InputAdornment } from '@material-ui/core';
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

const Register = () => {
    const classes = useStyles();
    const { register, handleSubmit, formState: { errors } , watch} = useForm({
        defaultValues: {
            first_name: '',
            last_name: '',
            phone: '',
            role: '',
            email: '',
            password: '',
            password_confirmation: ''
        }
    });
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const [showPasswordconfirmed, setshowPasswordconfirmed] = useState(false);
    const handleClickShowPasswordconfirmed = () => setshowPasswordconfirmed(!showPasswordconfirmed);
    const handleMouseDownPasswordconfirmed = (event) => event.preventDefault();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://laraproject.test/api/register', data);
            console.log(response.data);

            const userId = response.data.user.id;
            localStorage.setItem('userId', userId);

            if (response.data.user.role === 'freelancer') {
                navigate('/CreateFreelancer');
            } else {
                navigate('/login');
            }

        } catch (error) {
            console.error(error.response.data);
        }
    };

    return (
        <div className={classes.formContainer}>
            <div>
                <h2>Register</h2>
                <br />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <FormGroup>
                    <FormControl>
                        <InputLabel htmlFor="first_name">First Name*</InputLabel>
                        <Input
                            id="first_name"
                            {...register('first_name', { required: 'First name is required' })}
                        />
                        {errors.first_name && <FormHelperText error>{errors.first_name.message}</FormHelperText>}
                    </FormControl>

                    <FormControl>
                        <InputLabel htmlFor="last_name">Last Name*</InputLabel>
                        <Input
                            id="last_name"
                            {...register('last_name', { required: 'Last name is required' })}
                        />
                        {errors.last_name && <FormHelperText error>{errors.last_name.message}</FormHelperText>}
                    </FormControl>

                    <FormControl>
                        <InputLabel htmlFor="phone">Phone*</InputLabel>
                        <Input
                            id="phone"
                            {...register('phone', { required: 'Phone number is required' })}
                        />
                        {errors.phone && <FormHelperText error>{errors.phone.message}</FormHelperText>}
                    </FormControl>

                    <FormControl>
                        <InputLabel htmlFor="role">Role*</InputLabel>
                        <Select
                            id="role"
                            {...register('role', { required: 'Role is required' })}
                        >
                            <MenuItem value="freelancer">Freelancer</MenuItem>
                            <MenuItem value="client">Client</MenuItem>
                        </Select>
                        {errors.role && <FormHelperText error>{errors.role.message}</FormHelperText>}
                    </FormControl>

                    <FormControl>
                        <InputLabel htmlFor="email">Email*</InputLabel>
                        <Input
                            id="email"
                            type="email"
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

                    <FormControl>
                        <InputLabel htmlFor="password_confirmation">Confirm Password*</InputLabel>
                        <Input
                            id="password_confirmation" 
                            type={showPasswordconfirmed ? 'text' : 'password'}
                            {...register('password_confirmation', { required: 'Password confirmation is required',
                                 validate: (value) =>
                                    value === watch('password') || 'The password field confirmation does not match'
                            })}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPasswordconfirmed}
                                        onMouseDown={handleMouseDownPasswordconfirmed}
                                    >
                                        {showPasswordconfirmed ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {errors.password_confirmation && <FormHelperText error>{errors.password_confirmation.message}</FormHelperText>}
                    </FormControl>

                    <Button type="submit" variant="contained" color="primary" className={classes.submitButton}>Register</Button>
                </FormGroup>
            </form>
            <div className="login-link">
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Register;
