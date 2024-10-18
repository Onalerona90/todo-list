import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography, Card, CardContent, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await axios.post('/api/login', { username, password });
            navigate('/'); // Redirect to the home page (task list)
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={8}>
                <Card elevation={3}>
                    <CardContent>
                        <Typography variant="h5" component="h1" gutterBottom>
                            Login
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
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}

export default Login;
