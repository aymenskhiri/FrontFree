import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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


const CreateFreelancer = () => {
    const classes = useStyles();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
            setValue('user_id', storedUserId); 
        }
    }, [setValue]);


    
    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://laraproject.test/api/freelancer-profiles', data);
            console.log(response.data);
    
            const freelancerProfile = response.data.freelancerProfile; 
            const freelancerId = freelancerProfile.user_id; 
            localStorage.setItem('freelancerId', freelancerId);
            console.log('Freelancer ID:', freelancerId);
          
            navigate('/login');            
    
        } catch (error) {
            console.error('Freelancer creation error:', error.response.data);
        }
    };
    
    

    return (
        <div className={classes.formContainer}>
            <div>
                <h2>Create a Freelancer Porfile</h2>
                <br></br>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <FormGroup>
                    <FormControl>
                        <InputLabel htmlFor="bio">Bio</InputLabel>
                        <Input
                            id="bio"
                            type="text"
                            multiline
                            rows={4}
                            {...register('bio', { required: 'Bio is required' })}
                        />
                        {errors.bio && <FormHelperText error>{errors.bio.message}</FormHelperText>}
                    </FormControl>

                    <FormControl>
                        <InputLabel htmlFor="skills">Skills</InputLabel>
                        <Input
                            id="skills"
                            type="text"
                            {...register('skills', { required: 'Skills are required' })}
                        />
                        {errors.skills && <FormHelperText error>{errors.skills.message}</FormHelperText>}
                    </FormControl>

                    <FormControl>
                        <InputLabel htmlFor="hourly_price">Hourly Price</InputLabel>
                        <Input
                            id="hourly_price"
                            type="number"
                            {...register('hourly_price', { required: 'Hourly price is required' })}
                        />
                        {errors.hourly_price && <FormHelperText error>{errors.hourly_price.message}</FormHelperText>}
                    </FormControl>


                    <Button type="submit" variant="contained" color="primary" className={classes.submitButton}>Create Freelancer</Button>
                </FormGroup>
            </form>
        </div>
    );
};

export default CreateFreelancer;
