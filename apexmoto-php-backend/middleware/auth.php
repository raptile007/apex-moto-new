<?php
require_once __DIR__ . '/../config/database.php';

function require_user(): array {
    $uid = $_SERVER['HTTP_X_USER_ID'] ?? null;
    if (!$uid || !ctype_digit((string)$uid)) {
        json_response(['error' => 'Unauthorized'], 401); exit;
    }
    $stmt = db()->prepare('SELECT id, name, email, role FROM users WHERE id = ?');
    $stmt->execute([(int)$uid]);
    $user = $stmt->fetch();
    if (!$user) { json_response(['error' => 'Unauthorized'], 401); exit; }
    return $user;
}

function require_admin(): array {
    $user = require_user();
    if ($user['role'] !== 'admin') { json_response(['error' => 'Forbidden'], 403); exit; }
    return $user;
}
