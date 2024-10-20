<?php

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_GET['action'] ?? '';

    switch ($action) {
        case 'add':
            addTask();
            break;
        case 'update':
            updateTask();
            break;
        case 'delete':
            deleteTask();
            break;
        default:
            http_response_code(400);
            echo json_encode(['message' => 'Invalid action']);
            break;
    }
}

// Add task
function addTask() {
    global $pdo;
    session_start();

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Unauthorized']);
        return;
    }

    $description = $_POST['description'];
    $deadline = $_POST['deadline'];
    $priority = $_POST['priority'];

    $stmt = $pdo->prepare("INSERT INTO tasks (description, deadline, priority, user_id) VALUES (?, ?, ?, ?)");
    if ($stmt->execute([$description, $deadline, $priority, $_SESSION['user_id']])) {
        echo json_encode(['message' => 'Task added successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Error adding task']);
    }
}

// Update task
function updateTask() {
    global $pdo;
    session_start();

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Unauthorized']);
        return;
    }

    $taskId = $_POST['task_id'];
    $completed = $_POST['completed'];

    $stmt = $pdo->prepare("UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?");
    if ($stmt->execute([$completed, $taskId, $_SESSION['user_id']])) {
        echo json_encode(['message' => 'Task updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Error updating task']);
    }
}

// Delete task
function deleteTask() {
    global $pdo;
    session_start();

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Unauthorized']);
        return;
    }

    $taskId = $_POST['task_id'];

    $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?");
    if ($stmt->execute([$taskId, $_SESSION['user_id']])) {
        echo json_encode(['message' => 'Task deleted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Error deleting task']);
    }
}

?>
