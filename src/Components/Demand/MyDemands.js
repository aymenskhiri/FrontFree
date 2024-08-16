import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DynamicTable from '../Table/DynamicTable';
import UpdateDemand from './UpdateDemand';
import DeleteDemand from './DeleteDemand';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, MenuItem, Select, Typography } from '@mui/material';
import { SearchField, ArrowFilter } from '../Table/ReusableComponents';

export default function DemandList() {
  const [rows, setRows] = useState([]);
  const [updateDemand, setUpdateDemand] = useState(null);
  const [deleteDemand, setDeleteDemand] = useState(null);
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('service_date'); 
  const [approvalFilter, setApprovalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchDemands = async () => {
    const clientId = localStorage.getItem('client_id');

    if (!clientId) {
      console.error('Client ID is not set.');
      return;
    }

    try {
      const response = await axios.get(`http://laraproject.test/api/clients/${clientId}/demands`, {
        params: {
          search: search,
          sort_by: orderBy,
          sort_direction: order,
          approval: approvalFilter,
          status: statusFilter,
        },
      });
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching demands:', error);
    }
  };

  useEffect(() => {
    fetchDemands();
  }, [search, order, orderBy, approvalFilter, statusFilter]);

  const handleUpdate = (updatedDemand) => {
    setRows((prevRows) =>
      prevRows.map((r) => (r.id === updatedDemand.id ? updatedDemand : r))
    );
    setUpdateDemand(null); 
  };

  const handleDelete = (deletedId) => {
    setRows((prevRows) => prevRows.filter((r) => r.id !== deletedId));
    setDeleteDemand(null); 
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleApprovalChange = (event) => {
    setApprovalFilter(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const columns = [
    {
      field: 'service_date',
      label: (
        <ArrowFilter
          order={order}
          orderBy={orderBy}
          property="Date"
          onRequestSort={handleRequestSort}
        />
      ),
      align: 'center',
    },
    {
      field: 'description',
      label: (
        <ArrowFilter
          order={order}
          orderBy={orderBy}
          property="Description"
          onRequestSort={handleRequestSort}
        />
      ),
      align: 'center',
    },
    {
      field: 'begin_hour',
      label: (
        <ArrowFilter
          order={order}
          orderBy={orderBy}
          property="Start Hour"
          onRequestSort={handleRequestSort}
        />
      ),
      align: 'center',
    },
    {
      field: 'approuval',
      label: (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Approuval
          </Typography>
          <Select
            value={approvalFilter}
            displayEmpty
            onChange={handleApprovalChange}
            sx={{
              fontSize: '0.75rem',
              minWidth: 90,
              '& .MuiSelect-select': {
                padding: '6px 12px', 
              },
            }}
          >          
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Accepted">Accepted</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="On Hold">On Hold</MenuItem>
          </Select>
        </Box>
      ),
      align: 'center',
    },
    {
      field: 'status',
      label: (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Status
          </Typography>
          <Select
            value={statusFilter}
            displayEmpty
            onChange={handleStatusChange}
            sx={{
              fontSize: '0.75rem',
              minWidth: 90,
              '& .MuiSelect-select': {
                padding: '6px 12px',
              },
            }}
          >          
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
            <MenuItem value="Progressing">Progressing</MenuItem>
            <MenuItem value="On Hold">On Hold</MenuItem>
          </Select>
        </Box>
      ),
      align: 'center',
    },
    {
      field: 'actions',
      label: 'Actions',
      align: 'center',
      render: (value, row) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <IconButton onClick={() => setUpdateDemand(row)}>
            <EditIcon sx={{ color: 'primary.main' }} />
          </IconButton>
          <IconButton onClick={() => setDeleteDemand(row.id)}>
            <DeleteIcon sx={{ color: 'error.main' }} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div>
      <br></br><br></br>
      <Box sx={{ mb: -12, display: 'flex', justifyContent: 'flex-end', mr: 3 }}>
        <SearchField value={search} onChange={(e) => setSearch(e.target.value)} />
      </Box>
      <DynamicTable
        columns={columns}
        data={rows}
        title="My Demands"
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
      {updateDemand && (
        <UpdateDemand
          open={!!updateDemand}
          onClose={() => setUpdateDemand(null)}
          demand={updateDemand}
          onUpdate={handleUpdate}
        />
      )}
      {deleteDemand && (
        <DeleteDemand
          open={!!deleteDemand}
          onClose={() => setDeleteDemand(null)}
          demandId={deleteDemand}
          onDelete={() => handleDelete(deleteDemand)}
        />
      )}
    </div>
  );
}
