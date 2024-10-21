import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography, Card, CardContent, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost/todo-list/php-backend/api/auth.php?action=register', {
                username, 
                password
			},
			{
				withCredentials: true
			}
            );

			// Redirect the user to the main task page after login.
			if (response.data.message === 'Login successful') {
            	navigate('/'); // Redirect to the home page (task list)
			} else {
				setError(response.data.message);
			}
        } catch (err) {
            // Handle specific error message if available
			const errorMessage = err.response && err.response.data && err.response.data.message 
			? err.response.data.message 
			: 'All Field are required';
			setError(errorMessage);
        }
    };

    const userLogin = () => {
        navigate('/login');
    }

    return (
        <Container maxWidth="sm">
            <Box mt={8}>
                <Card elevation={3}>
                    <CardContent>
                        <Typography variant="h5" component="h1" gutterBottom>
                            Register
                        </Typography>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleRegister}
                        >
                            Register
                        </Button>
                        <Typography
                            component="p"
                            align='center'
                            pt={2}
                            style={{cursor: 'pointer' }}
                            onClick={userLogin}
                        >
                            Login
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}

export default Register;
