<?php

// Hash a password
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

// Verify a password
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

?>
