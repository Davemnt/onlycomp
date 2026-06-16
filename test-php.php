<?php
/**
 * Archivo de test simple para verificar que PHP está funcionando
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

try {
    echo json_encode([
        'success' => true,
        'message' => '¡PHP está funcionando correctamente!',
        'server_time' => date('Y-m-d H:i:s'),
        'php_version' => PHP_VERSION
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
