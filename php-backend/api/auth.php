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
        header("Access-Control-Allow-Methods: POST");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

require_once '../config/database.php';
require_once '../utils/helpers.php';

// Handle requests
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_GET['action'] ?? '';

    switch ($action) {
        case 'register':
            register();
            break;
        case 'login':
            login();
            break;
        case 'logout':
            logout();
            break;
        default:
            http_response_code(400);
            echo json_encode(['message' => 'Invalid action']);
            break;
    }
}

// Register user
function register() {
    global $pdo;

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

    $username = $requestData['username'];
    $password = hashPassword($requestData['password']);

    if (empty($username))
        echo json_encode(['message' => 'Username is required']);

    if (empty($password))
        echo json_encode(['message' => 'Password is required']);

    $stmt = $pdo->prepare("INSERT INTO users (id, username, password) VALUES (UUID(), :username, :password)");
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':password', $password);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Registration successful']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Error registering user']);
    }
}

// Login user
function login() {
    global $pdo;
	
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

    $username = $requestData['username'];
    $password = $requestData['password'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
	$stmt->bindParam(':username', $username);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && verifyPassword($password, $user['password'])) {
        // Create a session or store user info in a cookie
        session_start();
        $_SESSION['user_id'] = $user['id'];
        echo json_encode(['message' => 'Login successful']);
    } else {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid username or password']);
    }
}

// Logout user
function logout() {
    session_destroy($_SESSION['user_id']);
    echo json_encode(['message' => 'Logout successful']);
}

?>
