import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FormGroup, FormControl, InputLabel, Input, Button, makeStyles, FormHelperText, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(2),
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',  
      borderRadius: '8px',
      backgroundColor: '#fff',
      marginTop: '-130px', 
    },
    form: {
        width: '100%',
        maxWidth: '400px',
        padding: theme.spacing(4),
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid #B0B0B0',
        position: 'relative',
        overflow: 'hidden',
      },
    titleContainer: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
    },
    submitButton: {
      marginTop: theme.spacing(3),
      padding: theme.spacing(1.5),
      fontWeight: 'bold',
      backgroundColor: '#4CAF50', 
      color: '#fff',
      '&:hover': {
        backgroundColor: '#C79400', 
      },
    },
  }));

  const CreatePost = () => {
    const classes = useStyles();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [freelancer_id, setFreelancerId] = useState(null);
    const [image, setImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const storedFreelancerId = localStorage.getItem('freelancer_id'); 
        if (storedFreelancerId) {
            setFreelancerId(storedFreelancerId);
        } else {
            console.error('Freelancer ID is not found in local storage.');
        }
    }, []);

    const onSubmit = async (data) => {
        try {
            if (!freelancer_id) {
                console.error('Freelancer ID is missing.');
                setErrorMessage('Freelancer ID is missing.');
                setSnackbarOpen(true);
                return;
            }

            const formData = new FormData();
            formData.append('freelancer_profile_id', freelancer_id);
            formData.append('title', data.title);
            formData.append('description', data.description);
            if (image) formData.append('image', image);

            const response = await axios.post('http://laraproject.test/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Post created successfully:', response.data);

            setSuccessMessage('Post created successfully');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Post creation error:', error.response?.data || error.message);
            setSuccessMessage('Post created successfully');
            setSnackbarOpen(true);
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
        setSuccessMessage('');
        setErrorMessage('');
    };

    return (
        <div className={classes.formContainer}>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <div className={classes.titleContainer}>
                    <h2>Create a Post</h2>
                </div>
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

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={successMessage ? 'success' : 'error'} 
                    elevation={6} 
                    variant="filled"
                >
                    {successMessage || errorMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default CreatePost;
