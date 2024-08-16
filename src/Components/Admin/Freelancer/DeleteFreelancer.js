import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import axios from 'axios';

const DeleteFreelancer = ({ open, handleClose, freelancerId, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://laraproject.test/api/freelancer-profiles/${freelancerId}`);
      onDelete();
      handleClose();
    } catch (error) {
      console.error('Failed to delete freelancer:', error.response.data);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Freelancer Profile</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this freelancer profile?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleDelete} color="primary">Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteFreelancer;
