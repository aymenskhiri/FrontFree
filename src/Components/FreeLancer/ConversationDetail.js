import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { useParams } from 'react-router-dom'; // To get the conversation ID from the URL

const ConversationDetail = () => {
  const { conversationId } = useParams(); // Get the conversation ID from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://laraproject.test/api/conversations/${conversationId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await axios.post(`http://laraproject.test/api/conversations/${conversationId}/messages`, {
          conversation_id: conversationId,
          sender: 'freelancer',
          message: newMessage,
        });
        setMessages([...messages, response.data]); // Append new message to the conversation
        setNewMessage(''); // Clear the input field
      } catch (error) {
        console.error('Error sending message:', error.message);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6">Conversation with Client</Typography>
      <List>
        {messages.map((message) => (
          <ListItem key={message.id}>
            <ListItemText
              primary={`${message.sender === 'freelancer' ? 'You' : 'Client'}: ${message.message}`}
            />
          </ListItem>
        ))}
      </List>
      <TextField
        label="Type a message"
        fullWidth
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        multiline
        rows={4}
        variant="outlined"
        margin="normal"
      />
      <Button onClick={handleSendMessage} variant="contained">Send</Button>
    </Box>
  );
};

export default ConversationDetail;
