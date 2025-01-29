import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Rating from '@mui/material/Rating';
import axios from 'axios';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CardContainer = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '20px',
  margin: '20px 0',
});

const PostCard = styled(Card)({
  width: '30%',
  maxWidth: '345px',
  boxSizing: 'border-box',
  margin: '10px',
});

const CardActionsContainer = styled(CardActions)({
  display: 'flex',
  justifyContent: 'center', // Center the content horizontally
  alignItems: 'center',
  flexDirection: 'column', // Stack the buttons vertically
  gap: '15px', // Add some spacing between the buttons
});

const PostList = ({ posts = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedFreelancerId, setSelectedFreelancerId] = useState(null);
  const navigate = useNavigate();

  const postsPerPage = 12;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleExpandClick = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCreateDemand = (post) => {
    const { id: postId, freelancer_profile: { id: freelancerId }, client_id } = post;
    navigate(`/CreateDemand?post_id=${postId}&freelancer_id=${freelancerId}&client_id=${client_id}`);
  };

  const handleAvatarClick = (event, freelancerId) => {
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true);
    setSelectedFreelancerId(freelancerId);
  };

  const handlePopoverClose = () => {
    setPopoverOpen(false);
    setAnchorEl(null);
  };

  const handleViewProfileClick = () => {
    navigate(`/FreelancerProfile?freelancer_id=${selectedFreelancerId}`);
    handlePopoverClose();
  };

  const handleOpenConversation = async (post) => {
    try {
      const clientId = localStorage.getItem('client_id');
      const freelancerId = post.freelancer_profile.id;

      // Make an API request to open the conversation
      const response = await axios.post('http://laraproject.test/api/conversations/open', {
        client_id: clientId,
        freelancer_id: freelancerId,
      });

      const conversationId = response.data.id;
      // Redirect to the conversation page
      navigate(`/conversation/${conversationId}`);
    } catch (error) {
      console.error('Failed to open conversation:', error);
    }
  };

  const currentPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  return (
    <div>
      <CardContainer>
        {currentPosts.map((post) => {
          const freelancerProfile = post.freelancer_profile || {};
          const user = freelancerProfile.user || {};
          const firstName = user.first_name || '';
          const lastName = user.last_name || '';
          const avatarLetter = firstName[0] || 'F';

          return (
            <PostCard key={post.id}>
              <CardHeader
                avatar={
                  <div>
                    <Avatar
                      sx={{ bgcolor: red[500] }}
                      aria-label="recipe"
                      onClick={(event) => handleAvatarClick(event, freelancerProfile.id)}
                    >
                      {avatarLetter}
                    </Avatar>
                    <Popover
                      open={popoverOpen}
                      anchorEl={anchorEl}
                      onClose={handlePopoverClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                    >
                      <Button onClick={handleViewProfileClick}>View Profile Freelancer</Button>
                    </Popover>
                  </div>
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title={post.title}
                subheader={`Freelancer: ${firstName} ${lastName}`}
              />
              <CardMedia
                component="img"
                height="194"
                image={post.image ? `http://laraproject.test/storage/images/${post.image}` : "/static/images/cards/paella.jpg"}
                alt={post.title || "Post image"}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {post.description}
                </Typography>
              </CardContent>
              <CardActionsContainer>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <Typography component="legend">Best Review</Typography>
                  <Rating name="read-only" value={freelancerProfile.best_review || 0} readOnly />
                  <Button
                    variant="contained"
                    style={{ backgroundColor: 'gold', color: 'black' }}
                    size="small"
                    onClick={() => handleCreateDemand(post)}
                  >
                    Create Demand
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenConversation(post)}
                  >
                    Contact
                  </Button>
                </div>
                <ExpandMore
                  expand={expanded[post.id] || false}
                  onClick={() => handleExpandClick(post.id)}
                  aria-expanded={expanded[post.id]}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </CardActionsContainer>
              <Collapse in={expanded[post.id] || false} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography paragraph>
                    Created on: {new Date(post.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Collapse>
            </PostCard>
          );
        })}
      </CardContainer>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      />
    </div>
  );
};

export default PostList;
