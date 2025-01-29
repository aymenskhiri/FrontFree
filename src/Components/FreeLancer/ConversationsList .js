import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Chat as ChatIcon } from '@mui/icons-material';

const ConversationsList = () => {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState(null); // Added error state
  const freelancerId = localStorage.getItem('freelancer_id'); // Retrieve freelancer ID
  const navigate = useNavigate(); // Navigation function

  useEffect(() => {
    if (freelancerId) {
      fetchConversations(freelancerId); // Fetch all conversations for the freelancer
    }
  }, [freelancerId]);

  const fetchConversations = async (freelancerId) => {
    try {
      const response = await axios.get(`http://laraproject.test/api/conversations?freelancer_id=${freelancerId}`);
      setConversations(response.data); // Correctly set array data
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('No conversations found:', error.response.data.message);
        setError('No conversations found.');
      } else {
        console.error('Error fetching conversations:', error.message);
        setError('Failed to fetch conversations.');
      }
    }
  };

  const handleSelectConversation = (conversationId) => {
    navigate(`/conversation/${conversationId}`); // Navigate to conversation details
  };

  return (
    <Box>
  {error && <Typography color="error">{error}</Typography>}
  <List>
    {conversations.length === 0 ? (
      <Typography>No conversations available.</Typography>
    ) : (
      conversations.map((conversation) => (
        <ListItem button key={conversation.id} onClick={() => handleSelectConversation(conversation.id)}>
          {/* Replace text with an icon */}
          <ChatIcon style={{ fontSize: 80, color: '#4caf50' }} />
        </ListItem>
      ))
    )}
  </List>
</Box>
  );
};

export default ConversationsList;
