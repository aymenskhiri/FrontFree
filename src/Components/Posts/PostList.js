import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
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
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button'; 

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

const PostList = ({ posts = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState({});
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

  const currentPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  return (
    <div>
      <CardContainer>
        {currentPosts.map((post) => {
          const freelancerProfile = post.freelancer_profile || {};
          const user = freelancerProfile.user || {};
          const firstName = user.first_name || '';
          const lastName = user.last_name || '';
          const avatarLetter = firstName[0] || 'R';

          return (
            <PostCard key={post.id}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    {avatarLetter}
                  </Avatar>
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
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
                <ExpandMore
                  expand={expanded[post.id] || false}
                  onClick={() => handleExpandClick(post.id)}
                  aria-expanded={expanded[post.id]}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleCreateDemand(post)}
                >
                  Create Demand
                </Button>
              </CardActions>
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
