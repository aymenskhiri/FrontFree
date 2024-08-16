import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function DeleteDemand({ demandId, open, onClose, onDelete }) {

    const handleDelete = async () => {
        try {
            await axios.delete(`http://laraproject.test/api/demands/${demandId}`);
            onDelete(demandId);
            onClose();
        } catch (error) {
            console.error('Error deleting demand:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Demand</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this demand? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleDelete} color="primary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

DeleteDemand.propTypes = {
    demandId: PropTypes.number.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default DeleteDemand;
