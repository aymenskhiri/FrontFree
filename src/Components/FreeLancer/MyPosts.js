import * as React from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdatePost from '../Posts/UpdatePost';
import DeletePost from '../Posts/DeletePost';

function Row(props) {
  const { row, onUpdate, onDelete } = props;
  const [open, setOpen] = React.useState(false);
  const [updateOpen, setUpdateOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

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
          {row.title}
        </TableCell>
        <TableCell align="right">{row.description}</TableCell>
        <TableCell align="right">
          <img
            src={row.image ? `http://laraproject.test/storage/images/${row.image}` : "/static/images/cards/paella.jpg"} 
            alt={row.title || "Post image"}
            style={{ width: '100px', height: 'auto', objectFit: 'cover' }}
          />
        </TableCell>
        <TableCell align="right">
          <IconButton color="primary" onClick={() => setUpdateOpen(true)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => setDeleteOpen(true)}>
            <DeleteIcon />
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
                    <TableCell component="th" scope="row">Description</TableCell>
                    <TableCell>{row.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Created At</TableCell>
                    <TableCell>{row.created_at}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <UpdatePost
        open={updateOpen}
        handleClose={() => setUpdateOpen(false)}
        post={row}
        onUpdate={onUpdate}
      />
      <DeletePost
        open={deleteOpen}
        handleClose={() => setDeleteOpen(false)}
        postId={row.id}
        onDelete={onDelete}
      />
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    image: PropTypes.string, // Add image prop type
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default function CollapsibleTable() {
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    const fetchPosts = async () => {
      const freelancerId = localStorage.getItem('freelancer_id');
      console.log('Fetching posts for Freelancer ID:', freelancerId); // Check value here

      if (!freelancerId) {
        console.error('Freelancer ID is not set.');
        return;
      }

      try {
        const response = await fetch(`http://laraproject.test/api/freelancers/${freelancerId}/posts`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const posts = await response.json();
        console.log('Fetched posts:', posts);
        setRows(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleUpdate = (updatedPost) => {
    setRows((prevRows) => prevRows.map((row) => (row.id === updatedPost.id ? updatedPost : row)));
  };

  const handleDelete = (deletedPostId) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== deletedPostId));
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Title</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Image</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.id} row={row} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
