<?php
// Endpoint para generar token CSRF
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

session_start();

// Generar y guardar token en sesión
$token = bin2hex(random_bytes(32));
$_SESSION['form_token'] = $token;
$_SESSION['form_start_time'] = time();

echo json_encode(['token' => $token]);
