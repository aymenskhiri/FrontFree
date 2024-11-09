import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DynamicTable from '../Table/DynamicTable'; 
import { SearchField, ArrowFilter } from '../Table/ReusableComponents'; 
import { Select, MenuItem, TableCell, TableRow, Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function MyServices() {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('service_date');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDemands = async () => {
      const freelancer_id = localStorage.getItem('freelancer_id');
      if (!freelancer_id) {
        console.error('Freelancer ID is not set.');
        return;
      }

      try {
        const response = await axios.get(`http://laraproject.test/api/freelancers/${freelancer_id}/demands/approved`, {
          params: {
            search,
            sort: orderBy,
            order,
            status: statusFilter === 'All' ? '' : statusFilter
          }
        });
        setRows(response.data);
      } catch (error) {
        console.error('Error fetching demands:', error);
      }
    };

    fetchDemands();
  }, [search, order, orderBy, statusFilter]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const updateDemandStatus = async (demandId, newStatus) => {
    try {
      await axios.patch(`http://laraproject.test/api/demands/${demandId}/status`, { status: newStatus });
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === demandId ? { ...row, status: newStatus } : row
        )
      );
    } catch (error) {
      console.error('Error updating status:', error.response?.data || error.message);
    }
  };

  const columns = [
    {
      field: 'service_date',
      label: (
        <ArrowFilter
          order={order}
          orderBy={orderBy}
          property="service_date"
          onRequestSort={handleRequestSort}
        />
      ),
      align: 'center'
    },
    {
      field: 'description',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowFilter
            order={order}
            orderBy={orderBy}
            property="description"
            onRequestSort={handleRequestSort}
          />
        </div>
      ),
      align: 'center'
    },
    {
      field: 'begin_hour',
      label: (
        <ArrowFilter
          order={order}
          orderBy={orderBy}
          property="begin_hour"
          onRequestSort={handleRequestSort}
        />
      ),
      align: 'center'
    },
    {
      field: 'status',
      label: (
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          displayEmpty
          sx={{
            fontSize: '0.75rem',
            minWidth: 90,
            '& .MuiSelect-select': {
              padding: '6px 12px', // Adjust padding as needed
            },
          }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
          <MenuItem value="Progressing">Progressing</MenuItem>
          <MenuItem value="On Hold">On Hold</MenuItem>
        </Select>
      ),
      render: (value, row) => (
        <select
          onChange={(e) => updateDemandStatus(row.id, e.target.value)}
          value={value}
        >
          <option value="Done">Done</option>
          <option value="Progressing">Progressing</option>
          <option value="On Hold">On Hold</option>
        </select>
      ),
      align: 'center'
    },
  ];

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
        <TableCell component="th" scope="row">Email</TableCell>
        <TableCell>{row.client.user.email}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">First Name</TableCell>
        <TableCell>{row.client.user.first_name}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">Last Name</TableCell>
        <TableCell>{row.client.user.last_name}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">Phone Number</TableCell>
        <TableCell>{row.client.user.phone}</TableCell>
      </TableRow>
    </>
  );

  const icons = {
    CollapseIcon: KeyboardArrowDownIcon,
    ExpandIcon: KeyboardArrowUpIcon,
    UpdateIcon: ArrowUpwardIcon,
    DeleteIcon: ArrowDownwardIcon,
  };

  return (
    <div>
      <Box sx={{ mb: -12, display: 'flex', justifyContent: 'flex-end', mr: 1 }}>
        <SearchField value={search} onChange={(e) => setSearch(e.target.value)} />
      </Box>
      <DynamicTable
        columns={columns}
        data={rows}
        title="My Demands"
        renderAdditionalDetails={renderAdditionalDetails}
        icons={icons}
      />
    </div>
  );
}
