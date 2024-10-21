<?php
header("Content-Type: application/json");

// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        // may also be using PUT, PATCH, HEAD etc
        header("Access-Control-Allow-Methods: POST");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

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
        case 'tasks':
            getTasks();
            break;
        default:
            http_response_code(400);
            echo json_encode(['message' => 'Invalid action']);
            break;
    }
}

require_once '../config/database.php';

// Handle GET request to fetch tasks
function getTasks() {
	global $pdo;
	session_start();

	// Check if the user is authenticated
	if (!isset($_SESSION['user_id'])) {
		http_response_code(401);
		echo json_encode(['message' => 'Unauthorized']);
		exit();
	}

	if ($_SERVER['REQUEST_METHOD'] === 'GET') {
		$userid = $_SESSION['user_id'];

		$stmt = $pdo->prepare("SELECT * FROM tasks WHERE user_id = :userid ORDER BY priority DESC");
		$stmt->bindParam(':userid', $userid);
		$stmt->execute();
		$tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

		echo json_encode($tasks);
	}
}

// Handle PUT request to complete a task
// if ($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($_GET['action']) && $_GET['action'] === 'complete' && isset($_GET['id'])) {
//     $taskId = $_GET['id'];
//     $userId = $_SESSION['user_id'];

//     $stmt = $pdo->prepare("UPDATE tasks SET completed = 1 WHERE id = ? AND user_id = ?");
//     $stmt->execute([$taskId, $userId]);

//     if ($stmt->rowCount() > 0) {
//         echo json_encode(['message' => 'Task completed']);
//     } else {
//         http_response_code(400);
//         echo json_encode(['message' => 'Task not found or you do not have permission']);
//     }
// }

// Add task
function addTask() {
    global $pdo;
    session_start();

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Unauthorized']);
        return;
    }

	// Read the raw POST data
	$input = file_get_contents('php://input');
	$requestData = json_decode($input, true);

	// Check if the request data was successfully parsed
	if ($requestData === null) {
		// Handle the error
		http_response_code(400);
		echo json_encode(['error' => 'Invalid JSON']);
		exit;
	}

    $description = $requestData['description'];
    $deadline = date($requestData['deadline']);
    $priority = $requestData['priority'];
	$userid = ''. $_SESSION['user_id'] .'';

    $stmt = $pdo->prepare("INSERT INTO tasks (description, deadline, priority, user_id) VALUES (:task, :deadline, :priority, :userid)");
	$stmt->bindParam(':task', $description);
	$stmt->bindParam(':deadline', $deadline);
	$stmt->bindParam(':priority', $priority);
	$stmt->bindParam(':userid', $userid);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Task added successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Error adding task']);
    }
}

// // Update task
// function updateTask() {
//     global $pdo;
//     session_start();

//     if (!isset($_SESSION['user_id'])) {
//         http_response_code(401);
//         echo json_encode(['message' => 'Unauthorized']);
//         return;
//     }

//     $taskId = $_POST['task_id'];
//     $completed = $_POST['completed'];

//     $stmt = $pdo->prepare("UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?");
//     if ($stmt->execute([$completed, $taskId, $_SESSION['user_id']])) {
//         echo json_encode(['message' => 'Task updated successfully']);
//     } else {
//         http_response_code(500);
//         echo json_encode(['message' => 'Error updating task']);
//     }
// }

// // Delete task
// function deleteTask() {
//     global $pdo;
//     session_start();

//     if (!isset($_SESSION['user_id'])) {
//         http_response_code(401);
//         echo json_encode(['message' => 'Unauthorized']);
//         return;
//     }

//     $taskId = $_POST['task_id'];

//     $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?");
//     if ($stmt->execute([$taskId, $_SESSION['user_id']])) {
//         echo json_encode(['message' => 'Task deleted successfully']);
//     } else {
//         http_response_code(500);
//         echo json_encode(['message' => 'Error deleting task']);
//     }
// }

?>
