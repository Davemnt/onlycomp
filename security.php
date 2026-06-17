<?php
// Proteger acceso directo
if (!defined('ONLYCOMP_FORM')) {
    die('Acceso denegado');
}

class FormSecurity {
    private $config;
    private $ip;
    
    public function __construct($config) {
        $this->config = $config;
        $this->ip = $this->getRealIP();
    }
    
    public function getRealIP() {
        $ip_keys = ['HTTP_CF_CONNECTING_IP', 'HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
        foreach ($ip_keys as $key) {
            if (!empty($_SERVER[$key])) {
                $ips = explode(',', $_SERVER[$key]);
                return trim($ips[0]);
            }
        }
        return '0.0.0.0';
    }
    
    public function checkRateLimit() {
        $attempts_file = $this->config['files']['attempts_log'];
        $max_attempts = $this->config['security']['max_attempts'];
        $block_time = $this->config['security']['block_time'];
        $current_time = time();
        
        // Crear directorio si no existe
        $dir = dirname($attempts_file);
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }
        
        // Leer intentos previos
        $attempts = [];
        if (file_exists($attempts_file)) {
            $content = file_get_contents($attempts_file);
            $attempts = json_decode($content, true) ?: [];
        }
        
        // Limpiar intentos antiguos
        $attempts = array_filter($attempts, function($attempt) use ($current_time, $block_time) {
            return ($current_time - $attempt['time']) < $block_time;
        });
        
        // Contar intentos de esta IP
        $ip_attempts = array_filter($attempts, function($attempt) {
            return $attempt['ip'] === $this->ip;
        });
        
        if (count($ip_attempts) >= $max_attempts) {
            return false;
        }
        
        // Registrar intento actual
        $attempts[] = [
            'ip' => $this->ip,
            'time' => $current_time,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
        ];
        
        file_put_contents($attempts_file, json_encode($attempts));
        return true;
    }
    
    public function validateFormTime() {
        $min_time = $this->config['security']['min_form_time'];
        
        if (isset($_SESSION['form_start_time'])) {
            $elapsed = time() - $_SESSION['form_start_time'];
            return $elapsed >= $min_time;
        }
        
        return true; // Si no hay tiempo registrado, permitir
    }
    
    public function checkHoneypot() {
        return empty($_POST['website']);
    }
    
    public function validateCSRF() {
        if (!isset($_POST['form_token']) || !isset($_SESSION['form_token'])) {
            return false;
        }
        
        return hash_equals($_SESSION['form_token'], $_POST['form_token']);
    }
    
    public function checkSpamContent($text) {
        $spam_words = $this->config['spam_words'];
        $text_lower = strtolower($text);
        
        foreach ($spam_words as $word) {
            if (strpos($text_lower, $word) !== false) {
                return false;
            }
        }
        
        return true;
    }
    
    public function logError($message) {
        $log_file = $this->config['files']['error_log'];
        $timestamp = date('Y-m-d H:i:s');
        $log_entry = "[$timestamp] IP: {$this->ip} - $message\n";
        
        $dir = dirname($log_file);
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }
        
        file_put_contents($log_file, $log_entry, FILE_APPEND);
    }
}

class FormValidator {
    private $config;
    private $errors = [];
    
    public function __construct($config) {
        $this->config = $config;
    }
    
    public function validateName($name) {
        $name = $this->sanitize($name);
        $min = $this->config['validation']['name_min_length'];
        $max = $this->config['validation']['name_max_length'];
        
        if (empty($name) || strlen($name) < $min) {
            $this->errors[] = "El nombre debe tener al menos $min caracteres";
            return false;
        }
        
        if (strlen($name) > $max) {
            $this->errors[] = "El nombre no puede exceder $max caracteres";
            return false;
        }
        
        return $name;
    }
    
    public function validateEmail($email) {
        $email = $this->sanitize($email);
        $max = $this->config['validation']['email_max_length'];
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->errors[] = "Email inválido";
            return false;
        }
        
        if (strlen($email) > $max) {
            $this->errors[] = "El email no puede exceder $max caracteres";
            return false;
        }
        
        return $email;
    }
    
    public function validateMessage($message) {
        $message = $this->sanitize($message);
        $min = $this->config['validation']['message_min_length'];
        $max = $this->config['validation']['message_max_length'];
        
        if (empty($message) || strlen($message) < $min) {
            $this->errors[] = "El mensaje debe tener al menos $min caracteres";
            return false;
        }
        
        if (strlen($message) > $max) {
            $this->errors[] = "El mensaje no puede exceder $max caracteres";
            return false;
        }
        
        return $message;
    }
    
    public function sanitize($data) {
        return htmlspecialchars(trim(stripslashes($data)), ENT_QUOTES, 'UTF-8');
    }
    
    public function getErrors() {
        return $this->errors;
    }
    
    public function hasErrors() {
        return !empty($this->errors);
    }
}
?>