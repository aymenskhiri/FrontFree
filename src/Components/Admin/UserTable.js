import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DynamicTable from '../Table/DynamicTable';
import UpdateUser from './User/UpdateUser'; 
import DeleteUser from './User/DeleteUser';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, TableCell, TableRow } from '@mui/material';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [updateUser, setUpdateUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);

    useEffect(() => {
        axios.get('http://laraproject.test/api/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
            });
    }, []);

    const columns = [
        { field: 'id', label: 'ID', align: 'center' },
        { field: 'email', label: 'Email', align: 'center' },
        { field: 'first_name', label: 'First Name', align: 'center' },
        { field: 'last_name', label: 'Last Name', align: 'center' },
        { field: 'phone', label: 'Phone', align: 'center' },
        { field: 'role', label: 'Role', align: 'center' },
        {
            field: 'actions',
            label: 'Actions',
            align: 'center',
            render: (value, row) => (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <IconButton onClick={() => setUpdateUser(row)}>
                        <EditIcon sx={{ color: 'primary.main' }} />
                    </IconButton>
                    <IconButton onClick={() => setDeleteUser(row.id)}>
                        <DeleteIcon sx={{ color: 'error.main' }} />
                    </IconButton>
                </div>
            )
        }
    ];

    const renderAdditionalDetails = (row) => (
        <TableRow>
            <TableCell>Created At</TableCell>
            <TableCell>{row.created_at}</TableCell>
        </TableRow>
    );

    return (
        <>
            <DynamicTable
                columns={columns}
                data={users}
                title="Users List"
                renderAdditionalDetails={renderAdditionalDetails}
            />
            {updateUser && (
                <UpdateUser
                    open={!!updateUser}
                    handleClose={() => setUpdateUser(null)}
                    user={updateUser}
                    onUpdate={(updatedUser) => {
                        setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
                        setUpdateUser(null);
                    }}
                />
            )}
            {deleteUser && (
                <DeleteUser
                    open={!!deleteUser}
                    handleClose={() => setDeleteUser(null)}
                    userId={deleteUser}
                    onDelete={(deletedUserId) => {
                        setUsers(users.filter(user => user.id !== deletedUserId));
                        setDeleteUser(null);
                    }}
                />
            )}
        </>
    );
};

export default UserTable;
