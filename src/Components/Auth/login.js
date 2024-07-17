import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FormGroup, FormControl, InputLabel, Input, Button, makeStyles, FormHelperText } from '@material-ui/core';

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
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://laraproject.test/api/login', data);
            console.log(response.data);
        } catch (error) {
            console.error('Login error:', error.response.data);
        }
    };

    return (
        <div className={classes.formContainer}>
           <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <FormGroup>
                <FormControl>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <Input
                        id="email"
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                    />
                    {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
                </FormControl>

                <FormControl>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                        id="password"
                        type="password"
                        {...register('password', { required: 'Password is required' })}
                    />
                    {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
                </FormControl>

                <Button type="submit" variant="contained" color="primary" className={classes.submitButton}>Login</Button>
            </FormGroup>
            </form>
        </div>
    );
};

export default Login;
