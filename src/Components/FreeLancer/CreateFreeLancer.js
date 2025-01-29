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
      padding: theme.spacing(2),
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',  // Adding shadow to the form container
      borderRadius: '8px',  // Adding border radius for rounded corners
      backgroundColor: '#fff', // White background for the form container
    },
    form: {
        width: '100%',
        maxWidth: '400px',
        padding: theme.spacing(4), // Added padding to the form
        borderRadius: '8px', // Rounded corners for the form
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Shadow for the form
        border: '1px solid #B0B0B0', 
        position: 'relative', // Positioning for the shadow effect
        overflow: 'hidden', // Ensures that the rounded corners work with the border
      },
      
      titleContainer: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%', // Make sure it takes the full width of the form
    },
    submitButton: {
      marginTop: theme.spacing(3),
      padding: theme.spacing(1.5),
      fontWeight: 'bold',
      backgroundColor: '#4CAF50', // Green color
      color: '#fff',
      '&:hover': {
        backgroundColor: '#C79400', // Darker gold shade for hover
      },
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
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <div className={classes.titleContainer}>
            <h2>Create a Freelancer Porfile</h2>  {/* Title is now centered above the form */}
                </div>
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
                        <InputLabel htmlFor="hourly_price">Hourly Wage</InputLabel>
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
