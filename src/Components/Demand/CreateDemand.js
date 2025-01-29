import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormGroup,
  FormControl,
  InputLabel,
  Input,
  Button,
  FormHelperText,
  Snackbar,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '75vh',
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5', // Light background for the container
  },
  form: {
    width: '100%',
    maxWidth: '400px', // Increase max-width for a wider form
    backgroundColor: '#fff', // White background for the form
    borderRadius: '8px', // Rounded corners
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Shadow for a 3D effect
    padding: theme.spacing(4), // More padding for the content
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
    color: '#333', // Darker color for the title
  },
  submitButton: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(1.5),
    fontWeight: 'bold',
    backgroundColor: '#4caf50', // Material UI Blue color
    color: '#fff',
    '&:hover': {
      backgroundColor: '#C79400', // Darker blue on hover
    },
  },
  inputLabel: {
    color: '#333', // Darker label color
  },
  formControl: {
    marginBottom: theme.spacing(2),
  },
  input: {
    borderRadius: '4px', // Rounded input fields
    padding: theme.spacing(1),
    border: '1px solid #ddd', // Light border around inputs
    '&:focus': {
      borderColor: '#3f51b5', // Blue border on focus
    },
  },
}));


const Demand = () => {
  const classes = useStyles();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const postId = queryParams.get('post_id');
  const freelancerId = queryParams.get('freelancer_id');

  const storedClientId = localStorage.getItem('client_id');
  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // State for Snackbar
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    window.location.href = '/MyDemands';
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://laraproject.test/api/demands', {
        ...data,
        post_id: postId,
        freelancer_id: freelancerId,
        client_id: storedClientId,
        status: 'On Hold',
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);

      // Show success message
      setSuccessMessage('Demand created Successfully');
      setSnackbarOpen(true);
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
              inputProps={{ min: today }}
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

          <Button type="submit" variant="contained" color="primary" className={classes.submitButton}>
            Create Demand
          </Button>
        </FormGroup>
      </form>

      <Snackbar
  open={snackbarOpen}
  autoHideDuration={2000}
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} 
>
  <Alert onClose={handleSnackbarClose} severity="success" elevation={6} variant="filled">
    {successMessage}
  </Alert>
</Snackbar>

    </div>
  );
};

export default Demand;
