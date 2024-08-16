import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import DynamicTable from '../Table/DynamicTable'; 
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import axios from 'axios';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { TableCell, TableRow } from '@mui/material';
import { SearchField, ArrowFilter } from '../Table/ReusableComponents'; 

function DemandList() {
  const [rows, setRows] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDemands = async () => {
      const freelancerId = localStorage.getItem('freelancerId');
      if (!freelancerId) {
        console.error('Freelancer ID is not set.');
        return;
      }

      try {
        console.log('Sending search parameter:', search); // Debugging line
        const response = await axios.get(`http://laraproject.test/api/freelancers/${freelancerId}/demands`, {
          params: { search } 
        });
        console.log('Fetched demands:', response.data); // Debugging: Check API response
        setRows(response.data);
      } catch (error) {
        console.error('Error fetching demands:', error);
      }
    };

    fetchDemands();
  }, [search]); 

  const updateApprouval = async (demandId, newApprouval) => {
    try {
      const response = await axios.patch(`http://laraproject.test/api/demands/${demandId}/approuval`, { approuval: newApprouval });
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === demandId ? { ...row, approuval: newApprouval } : row
        )
      );
    } catch (error) {
      console.error('Error updating approuval:', error);
    }
  };

  const handleDialogOpen = (type, id) => {
    setDialogType(type);
    setSelectedRowId(id);
    setDialogOpen(true);
  };

  const handleDialogClose = (confirmed) => {
    setDialogOpen(false);
    if (confirmed && selectedRowId !== null) {
      updateApprouval(selectedRowId, dialogType === 'accept' ? 'Accepted' : 'Rejected');
    }
  };

  const renderAdditionalDetails = (row) => (
    <>
      <TableRow>
        <TableCell component="th" scope="row">Created At</TableCell>
        <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">Client :</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row"> Email</TableCell>
        <TableCell>{row.client.user.email}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row"> First Name</TableCell>
        <TableCell>{row.client.user.first_name}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row"> Last Name</TableCell>
        <TableCell>{row.client.user.last_name}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">Phone Number</TableCell>
        <TableCell>{row.client.user.phone}</TableCell>
      </TableRow>
    </>
  );

  const columns = [
    { field: 'service_date', label: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ArrowFilter 
          order="asc" 
          orderBy="Date" 
          property="Date" 
          onRequestSort={() => {}} 
        />
      </div>
    ), 
    align: 'center' },
    { field: 'description', label: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ArrowFilter 
          order="asc" 
          orderBy="Description" 
          property="Description" 
          onRequestSort={() => {}} 
        />
      </div>
    ), 
    align: 'center' },
    { field: 'begin_hour', label: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ArrowFilter 
          order="asc" 
          orderBy="Start Hour" 
          property="Start Hour" 
          onRequestSort={() => {}} 
        />
      </div>
    ), 
    align: 'center' },
    {
      field: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <Box>
          <DoneIcon
            style={{ cursor: 'pointer', color: 'green' }}
            onClick={() => handleDialogOpen('accept', row.id)}
          />
          <CloseIcon
            style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }}
            onClick={() => handleDialogOpen('reject', row.id)}
          />
        </Box>
      )
    }
  ];

  return (
    <Box>
      <br></br><br></br>
      <Box sx={{ mb: -12, display: 'flex', justifyContent: 'flex-end',mr: 2 }}>
        <SearchField value={search} onChange={(e) => setSearch(e.target.value)} />
      </Box>
      <DynamicTable
        columns={columns}
        data={rows} 
        title="Demands List"
        renderAdditionalDetails={renderAdditionalDetails}
        icons={{
          UpdateIcon: DoneIcon, 
          DeleteIcon: CloseIcon 
        }}
      />
      <Dialog
        open={dialogOpen}
        onClose={() => handleDialogClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogType === 'accept' ? 'Accept Offer' : 'Reject Offer'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogType === 'accept'
              ? 'Are you sure you want to accept this offer?'
              : 'Are you sure you want to decline this offer?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)}>Cancel</Button>
          <Button onClick={() => handleDialogClose(true)} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DemandList;
