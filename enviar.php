<?php
// Only Comp - Formulario de Contacto Seguro
define('ONLYCOMP_FORM', true);

// Configuración de seguridad
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('Content-Type: application/json');

// Iniciar sesión
session_start();

// Cargar configuración y clases de seguridad
$config = require_once 'config.php';
require_once 'security.php';

try {
    // Validar método POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }
    
    // Inicializar clases de seguridad
    $security = new FormSecurity($config);
    $validator = new FormValidator($config);
    
    // Verificar límite de intentos
    if (!$security->checkRateLimit()) {
        throw new Exception('Demasiados intentos. Intente más tarde.');
    }
    
    // Verificar honeypot (campo trampa para bots)
    if (!$security->checkHoneypot()) {
        $security->logError('Bot detectado - Honeypot activado');
        throw new Exception('Solicitud no válida');
    }
    
    // Verificar tiempo mínimo del formulario
    if (!$security->validateFormTime()) {
        $security->logError('Formulario enviado muy rápido');
        throw new Exception('Por favor, complete el formulario más despacio');
    }
    
    // Verificar token CSRF
    if (!$security->validateCSRF()) {
        $security->logError('Token CSRF inválido');
        throw new Exception('Token de seguridad inválido');
    }
    
    // Validar y sanitizar datos
    $nombre = $validator->validateName($_POST['nombre'] ?? '');
    $email = $validator->validateEmail($_POST['email'] ?? '');
    $mensaje = $validator->validateMessage($_POST['mensaje'] ?? '');
    
    // Verificar errores de validación
    if ($validator->hasErrors() || !$nombre || !$email || !$mensaje) {
        throw new Exception('Datos inválidos: ' . implode(', ', $validator->getErrors()));
    }
    
    // Verificar contenido spam
    $contenido_completo = $nombre . ' ' . $email . ' ' . $mensaje;
    if (!$security->checkSpamContent($contenido_completo)) {
        $security->logError('Contenido spam detectado');
        throw new Exception('Contenido no permitido');
    }

    // Preparar el email
    $to = $config['email']['to'];
    $subject = $config['email']['subject'];
    $from_name = $config['email']['from_name'];
    
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=utf-8',
        'From: ' . $from_name . ' <' . $to . '>',
        'Reply-To: ' . $email,
        'X-Mailer: PHP/' . phpversion(),
        'X-Priority: 1'
    ];
    
    $mensaje_html = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='utf-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { background: #1e3a8a; color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px 20px; background: #f8f9fa; }
            .info-card { background: white; padding: 20px; margin: 15px 0; border-left: 5px solid #1e3a8a; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .info-card strong { color: #1e3a8a; display: block; margin-bottom: 8px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #ffffff; }
            .security-info { font-size: 10px; color: #999; margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 3px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>🔧 Only Comp - Nueva Consulta</h1>
            </div>
            <div class='content'>
                <div class='info-card'>
                    <strong>👤 Nombre Completo:</strong>
                    " . htmlspecialchars($nombre) . "
                </div>
                <div class='info-card'>
                    <strong>📧 Email de Contacto:</strong>
                    " . htmlspecialchars($email) . "
                </div>
                <div class='info-card'>
                    <strong>💬 Mensaje:</strong><br><br>
                    " . nl2br(htmlspecialchars($mensaje)) . "
                </div>
                <div class='info-card'>
                    <strong>📅 Información del Envío:</strong>
                    Fecha: " . date('d/m/Y H:i:s') . "<br>
                    IP: " . $security->getRealIP() . "<br>
                    Navegador: " . htmlspecialchars($_SERVER['HTTP_USER_AGENT'] ?? 'No disponible') . "
                </div>
                <div class='security-info'>
                    <strong>🛡️ Verificaciones de Seguridad Pasadas:</strong><br>
                    ✅ Verificación anti-spam<br>
                    ✅ Validación CSRF<br>
                    ✅ Limite de velocidad<br>
                    ✅ Filtro de contenido<br>
                    ✅ Protección anti-bot
                </div>
            </div>
            <div class='footer'>
                <p><strong>OutletTech</strong> - Especialistas en Informática</p>
                <p>Este mensaje fue enviado desde el formulario de contacto verificado</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Intentar enviar el email
    if (mail($to, $subject, $mensaje_html, implode("\r\n", $headers))) {
        // Limpiar variables de sesión
        unset($_SESSION['form_start_time']);
        
        // Respuesta exitosa
        echo json_encode([
            'success' => true,
            'message' => '✅ Mensaje enviado correctamente. Te contactaremos pronto.'
        ]);
    } else {
        throw new Exception('Error interno del servidor al enviar el email');
    }
    
} catch (Exception $e) {
    // Manejar errores
    $error_message = $e->getMessage();
    
    // Log de error si la clase de seguridad está disponible
    if (isset($security)) {
        $security->logError('Error: ' . $error_message);
    }
    
    echo json_encode([
        'success' => false,
        'message' => '❌ ' . $error_message
    ]);
}

// Generar nuevo token CSRF para la próxima vez
$_SESSION['form_token'] = bin2hex(random_bytes(32));
$_SESSION['form_start_time'] = time();
?>