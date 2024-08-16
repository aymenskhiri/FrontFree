import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DynamicTable from '../Table/DynamicTable';
import UpdatePost from '../Posts/UpdatePost';
import DeletePost from '../Posts/DeletePost';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, TableCell, TableRow, Box } from '@mui/material';
import { SearchField, ArrowFilter } from '../Table/ReusableComponents'; 

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [updatePost, setUpdatePost] = useState(null);
  const [deletePost, setDeletePost] = useState(null);
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('asc'); 
  const [orderBy, setOrderBy] = useState('title'); 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://laraproject.test/api/posts', {
          params: { 
            search,
            sort_by: orderBy,
            sort_order: order
          }
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [search, order, orderBy]); 

  const handleUpdate = (post) => {
    setUpdatePost(post);
  };

  const handleDelete = (postId) => {
    setDeletePost(postId);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const columns = [
    { 
      field: 'title', 
      label: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowFilter 
            order={order}
            orderBy={orderBy}
            property="title"
            onRequestSort={handleRequestSort}
          />
        </div>
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
      field: 'image', 
      label: 'Image', 
      align: 'center',
      render: (value, row) => (
        <img
          src={value ? `http://laraproject.test/storage/images/${value}` : "/static/images/cards/paella.jpg"}
          alt={row.title || "Post image"}
          style={{ width: '100px', height: 'auto', objectFit: 'cover' }}
        />
      )
    },
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
            <DeleteIcon sx={{ color: 'error.main' }}  />
          </IconButton>
        </div>
      )
    }
  ];

  const renderAdditionalDetails = (row) => (
    <TableRow>
      <TableCell component="th" scope="row">Created At</TableCell>
      <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
    </TableRow>
  );

  return (
    <div>
      <Box sx={{ mb: -12, display: 'flex', justifyContent: 'flex-end',mr: 1  }}>
        <SearchField value={search} onChange={(e) => setSearch(e.target.value)} />
      </Box>
      <DynamicTable
        columns={columns}
        data={posts} 
        title="My Posts"
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        renderAdditionalDetails={renderAdditionalDetails}
      />
      {updatePost && (
        <UpdatePost
          open={!!updatePost}
          handleClose={() => setUpdatePost(null)}
          post={updatePost}
          onUpdate={(updatedPost) => {
            setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
            setUpdatePost(null);
          }}
        />
      )}
      {deletePost && (
        <DeletePost
          open={!!deletePost}
          handleClose={() => setDeletePost(null)}
          postId={deletePost}
          onDelete={() => {
            setPosts(posts.filter(post => post.id !== deletePost));
            setDeletePost(null);
          }}
        />
      )}
    </div>
  );
}
