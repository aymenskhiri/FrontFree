import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, TextField, Paper, Avatar, Divider, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const Conversation = () => {
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');
    const [messageError, setMessageError] = useState('');

    const clientId = localStorage.getItem('client_id');
    const freelancerId = localStorage.getItem('freelancer_id');

    useEffect(() => {
        const storedConversationId = localStorage.getItem('conversation_id');
        if (storedConversationId) {
            fetchMessages(storedConversationId); // Fetch messages for the existing conversation
            setConversation({ id: storedConversationId }); // Set conversation state with stored ID
        } else {
            openConversation(); // If no conversation ID is stored, open a new conversation
        }
    }, []);
    
    const openConversation = async () => {
        try {
            const response = await axios.post('http://laraproject.test/api/conversations/open', {
                client_id: clientId,
                freelancer_id: freelancerId,
            });
            
            setConversation(response.data);
            localStorage.setItem('conversation_id', response.data.id);  // Store the conversation ID
            setError('');
            
            // Fetch existing messages for this conversation
            fetchMessages(response.data.id);
        } catch (error) {
            console.error('Error opening conversation:', error.message);
            setError('Failed to open conversation');
        }
    };
    

    const fetchMessages = async (conversationId) => {
        try {
            const response = await axios.get(`http://laraproject.test/api/conversations/${conversationId}/messages`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error.message);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim()) {
            setMessageError('Message cannot be empty');
            return;
        }

        try {
            const sender = clientId ? 'client' : 'freelancer';
            const response = await axios.post('http://laraproject.test/api/conversations/send-message', {
                conversation_id: conversation.id,
                sender,
                message: newMessage,
            });

            setMessages([...messages, response.data]);
            setNewMessage('');
            setMessageError('');
        } catch (error) {
            console.error('Error sending message:', error.message);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', p: 2 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Conversation
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <Paper sx={{ p: 2, maxHeight: 400, overflowY: 'auto', mb: 2 }}>
                <Typography variant="h6">Messages</Typography>
                <Divider sx={{ my: 1 }} />

                {messages.map((msg) => (
                    <Box
                        key={msg.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1,
                            flexDirection: msg.sender === 'client' ? 'row' : 'row-reverse',
                        }}
                    >
                        <Avatar sx={{ bgcolor: msg.sender === 'client' ? 'primary.main' : 'secondary.main', mr: 1 }}>
                            {msg.sender === 'client' ? 'C' : 'F'}
                        </Avatar>
                        <Paper elevation={1} sx={{ p: 1.5, bgcolor: msg.sender === 'client' ? 'primary.light' : 'secondary.light', maxWidth: '80%' }}>
                            <Typography variant="body2">{msg.message}</Typography>
                        </Paper>
                    </Box>
                ))}
            </Paper>

            <form onSubmit={sendMessage}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
    <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        error={!!messageError}
        helperText={messageError}
        sx={{ mb: 1 }}
    />
    <Button
        variant="contained"
        type="submit"
        endIcon={<SendIcon />}
        sx={{ width: '120px', height: 'fit-content' }}  // Set button width here
    >
        Send
    </Button>
</Box>
            </form>
        </Box>
    );
};

export default Conversation;
