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
        minHeight: '100vh',
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

    useEffect(() => {
        const storedFreelancerId = localStorage.getItem('freelancerId');
        if (storedFreelancerId) {
            setFreelancerId(storedFreelancerId);
            setValue('freelancer_profile_id', storedFreelancerId); 
        }
    }, [setValue]);

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://laraproject.test/api/posts', data);
            console.log(response.data);
        } catch (error) {
            console.error('Post creation error:', error.response.data);
        }
    };

    return (
        <div className={classes.formContainer}>
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

                    <Button type="submit" variant="contained" color="primary" className={classes.submitButton}>Create Post</Button>
                </FormGroup>
            </form>
        </div>
    );
};

export default CreatePost;
