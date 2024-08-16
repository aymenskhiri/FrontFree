import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Rating, Typography, Container, Card, CardContent, CircularProgress, Stack, Snackbar, Alert, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  display: 'flex',
  justifyContent: 'center',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: '370px',
  width: '100%',
}));

const StyledContent = styled(CardContent)(() => ({
  flex: '1 0 auto',
}));

const StyledHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const StyledRating = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const LoadingWrapper = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
}));

const FreelancerProfile = () => {
  const location = useLocation();
  const [freelancer, setFreelancer] = useState(null);
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const params = new URLSearchParams(location.search);
  const freelancerId = params.get('freelancer_id');

  useEffect(() => {
    if (!freelancerId) {
      setError('Invalid freelancer ID.');
      setLoading(false);
      return;
    }

    const fetchFreelancerProfile = async () => {
      try {
        const response = await axios.get(`http://laraproject.test/api/freelancers/${freelancerId}`);
        console.log('API Response:', response.data);
        setFreelancer(response.data);
        setUserId(response.data.user_id);
        setHasRated(response.data.hasRated || false);
      } catch (error) {
        setError('Error fetching freelancer profile.');
        console.error('Error fetching freelancer profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerProfile();
  }, [freelancerId]);

  const handleRatingChange = async (event, newValue) => {
    if (newValue === null || newValue === undefined || !userId) {
      return;
    }

    try {
      console.log('Submitting rating:', newValue);

      await axios.post(`http://laraproject.test/api/freelancers/${freelancer.id}/rate`, {
        reviews: newValue,
        user_id: userId,
      });

      console.log('Rating submitted successfully');
      setRating(newValue);
      setHasRated(true);
      setSnackbarOpen(true); 
    } catch (error) {
      console.error('Error submitting rating:', error);

      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <StyledContainer>
        <CircularProgress />
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <Alert severity="error">{error}</Alert>
      </StyledContainer>
    );
  }

  if (!freelancer || !freelancer.user) {
    return (
      <StyledContainer>
        <Alert severity="error">Freelancer profile not available.</Alert>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledCard>
        <StyledContent>
          <StyledHeader variant="h5">
            {`${freelancer.user.first_name} ${freelancer.user.last_name}`}
          </StyledHeader>
          <Stack spacing={1}> 
            <Typography variant="body2">Email: {freelancer.user.email}</Typography>
            <Typography variant="body2">Phone: {freelancer.user.phone}</Typography>
            <Typography variant="body2">Bio: {freelancer.bio}</Typography>
            <Typography variant="body2">Skills: {freelancer.skills}</Typography>
            <Typography variant="body2">Hourly Wage: ${freelancer.hourly_price}</Typography>
            <Typography variant="body2">Number of Reviews: {freelancer.total_reviews_count}</Typography>
          </Stack>
          <StyledRating>
            <hr />
            <Typography component="legend">Rate this Freelancer</Typography>
            <Rating
              name="freelancer-rating"
              value={rating}
              onChange={handleRatingChange}
              readOnly={hasRated}
            />
          </StyledRating>
        </StyledContent>
      </StyledCard>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Rating submitted successfully"
        action={
          <Button color="inherit" onClick={handleSnackbarClose}>
            Close
          </Button>
        }
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Rating submitted successfully
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default FreelancerProfile;
