import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import axios from 'axios';

const UpdateUser = ({ open, handleClose, user, onUpdate }) => {
    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        if (user) {
            setValue('first_name', user.first_name);
            setValue('last_name', user.last_name);
            setValue('email', user.email);
            setValue('phone', user.phone);
            setValue('role', user.role);
        }
    }, [user, setValue]);

    const onSubmit = async (data) => {
        try {
            const response = await axios.put(`http://laraproject.test/api/users/${user.id}`, data);
            onUpdate(response.data.user);
            handleClose();
        } catch (error) {
            console.error('User update error:', error.response.data);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle style={{ textAlign: 'center' }}>Update User</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth
                        label="First Name"
                        margin="normal"
                        {...register('first_name', { required: 'First Name is required' })}
                    />
                    <TextField
                        fullWidth
                        label="Last Name"
                        margin="normal"
                        {...register('last_name', { required: 'Last Name is required' })}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        margin="normal"
                        {...register('email', { required: 'Email is required' })}
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        margin="normal"
                        {...register('phone', { required: 'Phone is required' })}
                    />
                    <TextField
                        fullWidth
                        label="Role"
                        margin="normal"
                        {...register('role', { required: 'Role is required' })}
                    />
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">Cancel</Button>
                        <Button type="submit" color="primary">Update</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateUser;
