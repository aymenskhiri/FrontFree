import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import axios from 'axios';

const UpdatePost = ({ open, handleClose, post, onUpdate }) => {
    const { register, handleSubmit, setValue } = useForm();
    const [image, setImage] = useState(null);
    const [freelancerProfileId, setFreelancerProfileId] = useState(null);

    useEffect(() => {
        const storedProfileId = localStorage.getItem('freelancer_profile_id');
        console.log('Retrieved freelancer_profile_id in UpdatePost:', storedProfileId);
        setFreelancerProfileId(storedProfileId);

        if (post) {
            setValue('title', post.title);
            setValue('description', post.description);
        }
    }, [post, setValue]);

    const onSubmit = async (data) => {
        if (!freelancerProfileId) {
            console.error('freelancerProfileId is missing');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('freelancer_profile_id', freelancerProfileId);
            formData.append('title', data.title);
            formData.append('description', data.description);
            if (image) formData.append('image', image);

            const response = await axios.put(`http://laraproject.test/api/posts/${post.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUpdate(response.data.post);
            handleClose();
        } catch (error) {
            console.error('Post update error:', error.response.data);
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };


    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Update Post</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth
                        label="Title"
                        {...register('title', { required: 'Title is required' })}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        {...register('description', { required: 'Description is required' })}
                    />
                    <input type="file" onChange={handleImageChange} />
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">Cancel</Button>
                        <Button type="submit" color="primary">Update</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdatePost;
