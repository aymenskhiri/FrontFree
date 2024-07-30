import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FormGroup, FormControl, InputLabel, Input, Select, MenuItem, Button, FormHelperText, makeStyles } from '@material-ui/core';

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
    const { register, handleSubmit, formState: { errors } } = useForm({
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

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://laraproject.test/api/register', data);
            console.log(response.data);

            const userId = response.data.user.id;
            localStorage.setItem('userId', userId);

            if (response.data.user.role === 'freelancer') {
                navigate('/CreateFreelancer');
            }
            else{
                navigate('/login');

            }

        } catch (error) {
            console.error(error.response.data);
        }
    };

    return (
        <div className={classes.formContainer}>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <FormGroup>
                    <FormControl>
                        <InputLabel htmlFor="first_name">First Name</InputLabel>
                        <Input
                            id="first_name"
                            {...register('first_name', { required: 'First name is required' })}
                        />
                        {errors.first_name && <FormHelperText error>{errors.first_name.message}</FormHelperText>}
                    </FormControl>

                    <FormControl>
                        <InputLabel htmlFor="last_name">Last Name</InputLabel>
                        <Input
                            id="last_name"
                            {...register('last_name', { required: 'Last name is required' })}
                        />
                        {errors.last_name && <FormHelperText error>{errors.last_name.message}</FormHelperText>}
                    </FormControl>

                    <FormControl>
                        <InputLabel htmlFor="phone">Phone</InputLabel>
                        <Input
                            id="phone"
                            {...register('phone', { required: 'Phone number is required' })}
                        />
                        {errors.phone && <FormHelperText error>{errors.phone.message}</FormHelperText>}
                    </FormControl>

                    <FormControl>
                        <InputLabel htmlFor="role">Role</InputLabel>
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

                    <FormControl>
                        <InputLabel htmlFor="password_confirmation">Confirm Password</InputLabel>
                        <Input
                            id="password_confirmation"
                            type="password"
                            {...register('password_confirmation', { required: 'Password confirmation is required' })}
                        />
                        {errors.password_confirmation && <FormHelperText error>{errors.password_confirmation.message}</FormHelperText>}
                    </FormControl>

                    <Button type="submit" variant="contained" color="primary" className={classes.submitButton}>Register</Button>
                </FormGroup>
            </form>
        </div>
    );
};

export default Register;
