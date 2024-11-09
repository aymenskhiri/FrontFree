import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FormGroup, FormControl, InputLabel, Input, Button, makeStyles, FormHelperText } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        padding: theme.spacing(2),
    },
    form: {
        width: '100%', 
        maxWidth: '400px', 
    },
    submitButton: {
        marginTop: theme.spacing(3),
    },
}));

const CreatePost = () => {
    const classes = useStyles();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [freelancerId, setFreelancerId] = useState(null);
    const [image, setImage] = useState(null);

      useEffect(() => {
        const storedFreelancerId = localStorage.getItem('freelancer_id');  // Use lowercase key
        if (storedFreelancerId) {
            setFreelancerId(storedFreelancerId);
        } else {
            console.error('Freelancer ID is not found in local storage.');
        }
    }, []);

    const onSubmit = async (data) => {
        try {
            if (!freelancerId) {
                console.error('Freelancer ID is missing.');
                return;
            }

            const formData = new FormData();
            formData.append('freelancer_profile_id', freelancerId);
            formData.append('title', data.title);
            formData.append('description', data.description);
            if (image) formData.append('image', image);

            const response = await axios.post('http://laraproject.test/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Post created successfully:', response.data);
        } catch (error) {
            console.error('Post creation error:', error.response?.data || error.message);
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div className={classes.formContainer}>
            <div>
                <h2>Create a Post</h2>
                <br />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <FormGroup>
                    <FormControl>
                        <InputLabel htmlFor="title">Title</InputLabel>
                        <Input
                            id="title"
                            type="text"
                            {...register('title', { required: 'Title is required' })}
                        />
                        {errors.title && <FormHelperText error>{errors.title.message}</FormHelperText>}
                    </FormControl>

                    <FormControl>
                        <InputLabel htmlFor="description">Description</InputLabel>
                        <Input
                            id="description"
                            type="text"
                            multiline
                            rows={4}
                            {...register('description', { required: 'Description is required' })}
                        />
                        {errors.description && <FormHelperText error>{errors.description.message}</FormHelperText>}
                    </FormControl>

                    <FormControl>
                        <InputLabel htmlFor="image">Image</InputLabel>
                        <Input
                            id="image"
                            type="file"
                            onChange={handleImageChange}
                        />
                        {errors.image && <FormHelperText error>{errors.image.message}</FormHelperText>}
                    </FormControl>

                    <Button type="submit" variant="contained" color="primary" className={classes.submitButton}>
                        Create Post
                    </Button>
                </FormGroup>
            </form>
        </div>
    );
};

export default CreatePost;
