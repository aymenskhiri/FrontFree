import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import axios from 'axios';

const DeleteUser = ({ open, handleClose, userId, onDelete }) => {
    const handleDelete = async () => {
        try {
            await axios.delete(`http://laraproject.test/api/users/${userId}`);
            onDelete(userId);
            handleClose();
        } catch (error) {
            console.error('User deletion error:', error.response.data);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Delete User</DialogTitle>
            <DialogContent>
                <DialogContentText>Are you sure you want to delete this user?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={handleDelete} color="primary">Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteUser;
