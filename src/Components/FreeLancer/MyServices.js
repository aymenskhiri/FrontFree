import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';

function Row(props) {
    const { row, onStatusChange } = props;
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.service_date}
                </TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">{row.begin_hour}</TableCell>
                <TableCell align="center">
                    <select
                        onChange={(e) => onStatusChange(row.id, e.target.value)}
                        value={row.status}
                    >
                        <option value="Done">Done</option>
                        <option value="Progressing">Progressing</option>
                        <option value="On Hold">On Hold</option>
                    </select>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Details
                            </Typography>
                            <Table size="small" aria-label="details">
                                <TableBody>
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
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        id: PropTypes.number.isRequired,
        service_date: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
        client: PropTypes.shape({
            user: PropTypes.shape({
                email: PropTypes.string.isRequired,
                first_name: PropTypes.string.isRequired,
                last_name: PropTypes.string.isRequired,
                phone: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
    }).isRequired,
    onStatusChange: PropTypes.func.isRequired,
};

export default function MyServices() {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchDemands = async () => {
            const freelancerId = localStorage.getItem('freelancerId');
            console.log('Stored Freelancer ID:', freelancerId);

            if (!freelancerId) {
                console.error('Freelancer ID is not set.');
                return;
            }

            try {
                const response = await axios.get(`http://laraproject.test/api/freelancers/${freelancerId}/demands/approved`);
                console.log('Fetched demands:', response.data);
                setRows(response.data);
            } catch (error) {
                console.error('Error fetching demands:', error);
            }
        };

        fetchDemands();
    }, []);

    const updateDemandStatus = async (demandId, newStatus) => {
        try {
            console.log('Updating status for demandId:', demandId, 'to', newStatus);
            const response = await axios.patch(`http://laraproject.test/api/demands/${demandId}/status`, { status: newStatus });
            console.log('Status updated:', response.data);
            setRows((prevRows) =>
                prevRows.map((row) =>
                    row.id === demandId ? { ...row, status: newStatus } : row
                )
            );
        } catch (error) {
            console.error('Error updating status:', error.response?.data || error.message); 
        }
    };

    return (
        <div>
            <div style={{ textAlign: 'center' }}>
                <h2>My Demands</h2>
            </div>
            <br />
            <br />

            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Service Date</TableCell>
                            <TableCell align="center">Description</TableCell>
                            <TableCell align="center">Begin Hour</TableCell>
                            <TableCell align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <Row key={row.id} row={row} onStatusChange={updateDemandStatus} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
