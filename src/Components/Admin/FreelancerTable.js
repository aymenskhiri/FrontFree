import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DynamicTable from '../Table/DynamicTable';
import UpdateFreelancer from './Freelancer/UpdateFreelancer';
import DeleteFreelancer from './Freelancer/DeleteFreelancer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

const FreelancerTable = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      const response = await axios.get('http://laraproject.test/api/freelancer-profiles');
      setFreelancers(response.data);
    } catch (error) {
      console.error('Failed to fetch freelancers:', error.message);
    }
  };

  const handleUpdate = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setOpenUpdateDialog(true);
  };

  const handleDelete = (id) => {
    setSelectedFreelancer({ id });
    setOpenDeleteDialog(true);
  };

  const handleUpdateClose = () => {
    setOpenUpdateDialog(false);
    setSelectedFreelancer(null);
    fetchFreelancers(); // Refresh the list after update
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setSelectedFreelancer(null);
    fetchFreelancers(); // Refresh the list after delete
  };

  return (
    <div>
      <DynamicTable
        columns={[
          { field: 'id', label: 'ID', align: 'center' },
          { field: 'bio', label: 'Bio', align: 'center' },
          { field: 'skills', label: 'Skills', align: 'center' },
          { field: 'hourly_price', label: 'Hourly Price', align: 'center' },
          {
            field: 'actions',
            label: 'Actions',
            align: 'center',
            render: (value, row) => (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <IconButton onClick={() => handleUpdate(row)}>
                  <EditIcon sx={{ color: 'primary.main' }} />
                </IconButton>
                <IconButton onClick={() => handleDelete(row.id)}>
                  <DeleteIcon sx={{ color: 'error.main' }} />
                </IconButton>
              </div>
            )
          }
        ]}
        data={freelancers}
        title="Freelancer Profiles"
      />
      {selectedFreelancer && (
        <UpdateFreelancer
          open={openUpdateDialog}
          handleClose={handleUpdateClose}
          freelancer={selectedFreelancer}
          onUpdate={fetchFreelancers}
        />
      )}
      {selectedFreelancer && (
        <DeleteFreelancer
          open={openDeleteDialog}
          handleClose={handleDeleteClose}
          freelancerId={selectedFreelancer.id}
          onDelete={fetchFreelancers}
        />
      )}
    </div>
  );
};

export default FreelancerTable;
