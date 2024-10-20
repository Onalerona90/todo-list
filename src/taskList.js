import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    AppBar, Toolbar, Typography, Button, TextField, Container, Card, CardContent,
    IconButton, Grid, Box, Alert
} from '@mui/material';
import { CheckCircleOutline, AddCircleOutline } from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch tasks on component mount
    useEffect(() => {
        axios.get('http://localhost/todo-list/php-backend/api/tasks.php?action=tasks', {
            withCredentials: true // Include session cookies
        })
        .then(res => {
			setTasks(res.data)
		})
        .catch(err => {
            console.error(err);
            navigate('/login'); // Redirect to login if not authenticated
        });
    }, [navigate]);

    // Add new task function
    const addTask = () => {
        if (newTask && deadline) {
            axios.post('http://localhost/todo-list/php-backend/api/tasks.php?action=add', {
                description: newTask,
                deadline: deadline,
                priority: priority
            }, {
                withCredentials: true // Include session cookies
            })
            .then(res => {
                setTasks(res.data); // Use response task data to update state
                window.location.reload();
            })
            .catch(err => setError('Failed to add task. Please try again.'));
        } else {
            setError('Please provide both task description and deadline.');
        }
    };

    // Mark task as complete
    const completeTask = (id) => {
        axios.post(`http://localhost/todo-list/php-backend/api/tasks.php?action=complete`, {
			id: `${id}`,
		}, {
            withCredentials: true, // Include session cookies
        })
        .then(res => {
            setTasks(tasks.map(task => task.id === id ? { ...task, completed: true } : task));
        })
        .catch(err => console.error(err));
    };

    // Logout function
    const handleLogout = async () => {
        await axios.post('http://localhost/todo-list/php-backend/api/auth.php?action=logout', {
			withCredentials: true
		});
        navigate('/login');
    };

    return (
        <div className="TaskList">
            {/* Navbar */}
            <AppBar position="static" sx={{ backgroundColor: '#6200ea' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Todo List
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container maxWidth="md" sx={{ mt: 5 }}>
                <Card elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Add New Task
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <TextField
                                fullWidth
                                label="Task Description"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="datetime-local"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Priority (0-10)"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                fullWidth
                                startIcon={<AddCircleOutline />}
                                variant="contained"
                                color="primary"
                                onClick={addTask}
                                sx={{ height: '100%' }}
                            >
                                Add Task
                            </Button>
                        </Grid>
                    </Grid>
                </Card>

                {/* Task List */}
                <Box mt={5}>
                    <Typography variant="h5" gutterBottom>
                        Your Tasks
                    </Typography>
                    <Grid container spacing={2}>
						{Array.isArray(tasks) && tasks.map((task) => (
                            <Grid item xs={12} key={task.id}>
                                <Card elevation={1} sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="div">
                                            {task.description}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Deadline: {format(new Date(task.deadline), 'MMM dd, yyyy HH:mm')}
                                        </Typography>
                                        {task.completed && (
                                            <Typography variant="body2" color="success.main">
                                                Completed
                                            </Typography>
                                        )}
                                    </CardContent>
                                    <IconButton
                                        color={task.completed ? 'success' : 'default'}
                                        onClick={() => completeTask(task.id)}
                                    >
                                        <CheckCircleOutline />
                                    </IconButton>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </div>
    );
}

export default TaskList;
