<?php
// Configuración de OutletTech - Formulario de Contacto
// IMPORTANTE: Cambia estos valores por los de tu servidor

return [
    // Configuración del correo
    'email' => [
        'to' => 'info@outlettech.com.ar', // Cambia por tu email real
        'subject' => 'Nueva consulta desde OutletTech',
        'from_name' => 'OutletTech',
    ],
    
    // Configuración de seguridad
    'security' => [
        'max_attempts' => 5,           // Máximo intentos por IP
        'block_time' => 300,           // Tiempo de bloqueo en segundos (5 min)
        'min_form_time' => 3,          // Tiempo mínimo para llenar formulario
        'token_lifetime' => 3600,      // Vida del token CSRF (1 hora)
    ],
    
    // Configuración de validación
    'validation' => [
        'name_min_length' => 2,
        'name_max_length' => 100,
        'email_max_length' => 100,
        'message_min_length' => 10,
        'message_max_length' => 1000,
    ],
    
    // Palabras prohibidas (anti-spam)
    'spam_words' => [
        'viagra', 'casino', 'loan', 'bitcoin', 'crypto', 
        'investment', 'pills', 'porn', 'sex', 'dating',
        'gambling', 'lottery', 'winner', 'prize'
    ],
    
    // Configuración de archivos
    'files' => [
        'attempts_log' => 'logs/intentos.txt',
        'error_log' => 'logs/errores.txt',
    ]
];
?>