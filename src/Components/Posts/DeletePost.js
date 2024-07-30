import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import axios from 'axios';

const DeletePost = ({ open, handleClose, postId, onDelete }) => {
    const handleDelete = async () => {
        try {
            await axios.delete(`http://laraproject.test/api/posts/${postId}`);
            onDelete(postId);
            handleClose();
        } catch (error) {
            console.error('Post deletion error:', error.response.data);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogContent>
                <DialogContentText>Are you sure you want to delete this post?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={handleDelete} color="primary">Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeletePost;
