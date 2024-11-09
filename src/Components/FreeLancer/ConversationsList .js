import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // To navigate to the conversation details

const ConversationsList = () => {
  const [conversations, setConversations] = useState([]);
  const freelancerId = localStorage.getItem('freelancer_id'); // Get the freelancer ID from local storage
  const navigate = useNavigate(); // To navigate to the selected conversation page

  useEffect(() => {
    if (freelancerId) {
      fetchConversations(freelancerId); // Fetch conversations based on freelancer ID
    }
  }, [freelancerId]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`http://laraproject.test/api/conversations/${freelancerId}`);
      setConversations(response.data);
    } catch (error) {
      // Check if the error has a response from the server
      if (error.response) {
        console.error('Server responded with error:', error.response.data);
      } else {
        console.error('Error occurred while fetching conversations:', error.message);
      }
    }
  };
  

  const handleSelectConversation = (conversationId) => {
    // Navigate to the conversation detail page with the selected conversation ID
    navigate(`/conversation/${conversationId}`);
  };

  return (
    <Box>
      <Typography variant="h6">Your Conversations</Typography>
      <List>
        {conversations.length === 0 ? (
          <Typography>No conversations available.</Typography>
        ) : (
          conversations.map((conversation) => (
            <ListItem button key={conversation.id} onClick={() => handleSelectConversation(conversation.id)}>
              {/* Display the client's name dynamically */}
              <ListItemText primary={`Conversation with ${conversation.client_name}`} />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default ConversationsList;
