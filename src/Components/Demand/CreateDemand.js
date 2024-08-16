import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup, FormControl, InputLabel, Input, Button, FormHelperText } from '@material-ui/core';

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

const Demand = () => {
  const classes = useStyles();
  const { search } = useLocation(); 
  const queryParams = new URLSearchParams(search);
  const postId = queryParams.get('post_id');
  const freelancerId = queryParams.get('freelancer_id');

  const storedClientId = localStorage.getItem('clientId');

  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://laraproject.test/api/demands', {
        ...data,
        post_id: postId,
        freelancer_id: freelancerId,
        client_id: storedClientId, 
        status: 'On Hold'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Demand creation error:', error.response?.data || error.message);

      // Handle validation errors
      if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = error.response.data.errors;
        Object.keys(validationErrors).forEach((field) => {
          setError(field, {
            type: 'server',
            message: validationErrors[field][0],
          });
        });
      }
    }
  };

  return (
    <div className={classes.formContainer}>
      <div>
        <h2>Demand a Service</h2>
        <br />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <FormGroup>
          <FormControl>
            <InputLabel htmlFor="service_date">Service Date</InputLabel>
            <br /><br />
            <Input
              id="service_date"
              type="date"
              {...register('service_date', { 
                required: 'Service date is required',
              })}
              inputProps={{ min: today }} // Disable dates before today
            />
            {errors.service_date && <FormHelperText error>{errors.service_date.message}</FormHelperText>}
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
            <br />
            <InputLabel htmlFor="begin_hour">Start Hour</InputLabel>
            <Input
              id="begin_hour"
              type="time"
              {...register('begin_hour', { required: 'Begin hour is required' })}
            />
            {errors.begin_hour && <FormHelperText error>{errors.begin_hour.message}</FormHelperText>}
          </FormControl>

          <Button type="submit" variant="contained" color="primary" className={classes.submitButton}>Create Demand</Button>
        </FormGroup>
      </form>
    </div>
  );
};

export default Demand;
