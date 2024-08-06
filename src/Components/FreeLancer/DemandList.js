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
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

function Row({ row, onApprouvalChange }) {
    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const [selectedRowId, setSelectedRowId] = useState(null);

    const handleDialogOpen = (type, id) => {
        setDialogType(type);
        setSelectedRowId(id);
        setDialogOpen(true);
    };

    const handleDialogClose = (confirmed) => {
        setDialogOpen(false);
        if (confirmed) {
            onApprouvalChange(selectedRowId, dialogType === 'accept' ? 'Accepted' : 'Rejected');
        }
    };

    return (
        <>
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
                    <IconButton onClick={() => handleDialogOpen('accept', row.id)}>
                        <DoneIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDialogOpen('reject', row.id)}>
                        <CloseIcon />
                    </IconButton>
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
        </>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        id: PropTypes.number.isRequired,
        service_date: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        approuval: PropTypes.string.isRequired,
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
    onApprouvalChange: PropTypes.func.isRequired,
};

export default function DemandList() {
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
                const response = await axios.get(`http://laraproject.test/api/freelancers/${freelancerId}/demands`);
                console.log('Fetched demands:', response.data);
                setRows(response.data);
            } catch (error) {
                console.error('Error fetching demands:', error);
            }
        };

        fetchDemands();
    }, []);

    const updateApprouval = async (demandId, newApprouval) => {
        try {
            console.log('Updating approuval for demandId:', demandId, 'to', newApprouval);
            const response = await axios.patch(`http://laraproject.test/api/demands/${demandId}/approuval`, { approuval: newApprouval });
            console.log('Approuval updated:', response.data);
            setRows((prevRows) =>
                prevRows.map((row) =>
                    row.id === demandId ? { ...row, approuval: newApprouval } : row
                )
            );
        } catch (error) {
            console.error('Error updating approuval:', error);
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Date</TableCell>
                        <TableCell align="center">Description</TableCell>
                        <TableCell align="center">Begin Hour</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row key={row.id} row={row} onApprouvalChange={updateApprouval} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
