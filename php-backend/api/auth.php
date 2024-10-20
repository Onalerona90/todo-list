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

    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("INSERT INTO users (id, username, password) VALUES (UUID(), ?, ?)");
    if ($stmt->execute([$username, $password])) {
        echo json_encode(['message' => 'Registration successful']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Error registering user']);
    }
}

// Login user
function login() {
    global $pdo;

    $username = $_POST['username'];
    $password = $_POST['password'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
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
    session_start();
    session_destroy();
    echo json_encode(['message' => 'Logout successful']);
}

?>
