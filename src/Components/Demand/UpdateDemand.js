import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

function UpdateDemand({ demand, open, onClose, onUpdate }) {
    const [serviceDate, setServiceDate] = useState(demand.service_date);
    const [description, setDescription] = useState(demand.description);
    const [begin_hour, setBegin_hour] = useState(demand.begin_hour);

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://laraproject.test/api/demands/${demand.id}`, {
                service_date: serviceDate,
                description: description,
                begin_hour: begin_hour,
            });

            if (typeof onUpdate === 'function') {
                onUpdate(response.data.demand); 
            } else {
                console.error('onUpdate prop is not a function');
            }

            onClose();
        } catch (error) {
            console.error('Error updating demand:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <div style={{ textAlign: 'center' }}>
            <DialogTitle>Update Demand</DialogTitle>
            </div>
            <DialogContent>
                <DialogContentText>
                    Please update the details of the demand.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Service Date"
                    type="date"
                    fullWidth
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Description"
                    type="text"
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Begin Hour"
                    type="time"
                    fullWidth
                    value={begin_hour}
                    onChange={(e) => setBegin_hour(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleUpdate} color="primary">
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
}

UpdateDemand.propTypes = {
    demand: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default UpdateDemand;
