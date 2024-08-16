import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

const UpdateFreelancer = ({ open, handleClose, freelancer, onUpdate }) => {
  const [bio, setBio] = useState(freelancer.bio || '');
  const [skills, setSkills] = useState(freelancer.skills || '');
  const [hourlyPrice, setHourlyPrice] = useState(freelancer.hourly_price || '');

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://laraproject.test/api/freelancer-profiles/${freelancer.id}`, {
        user_id: freelancer.user_id, 
        bio,
        skills,
        hourly_price: hourlyPrice
      });
      onUpdate(response.data);
      handleClose();
    } catch (error) {
      console.error('Failed to update freelancer:', error.response?.data || error.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Freelancer</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Bio"
          fullWidth
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Skills"
          fullWidth
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Hourly Price"
          fullWidth
          type="number"
          value={hourlyPrice}
          onChange={(e) => setHourlyPrice(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleUpdate}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateFreelancer;
