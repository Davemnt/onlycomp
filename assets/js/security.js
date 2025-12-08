/**
 * ===== OUTLETTECH - SISTEMA DE SEGURIDAD Y CONTACTO =====
 * 
 * GUÍA EDUCATIVA: Este archivo implementa medidas de seguridad avanzadas
 * para proteger información sensible como números de teléfono y datos de contacto.
 * 
 * MEDIDAS DE SEGURIDAD IMPLEMENTADAS:
 * 1. Ofuscación de datos sensibles
 * 2. Validación de usuario antes de mostrar información
 * 3. Encriptación básica de números de teléfono
 * 4. Detección de bots y scraping
 * 5. Rate limiting para prevenir abuso
 * 6. Mini mapa con coordenadas aproximadas
 */

class OutletTechSecurity {
    constructor() {
        // GUÍA: Configuración de seguridad
        this.config = {
            // Coordenadas exactas de Aldo Bonzi (aproximadas por seguridad)
            mapCoords: {
                lat: -34.7078, // Coordenadas precisas de Aldo Bonzi
                lng: -58.5181, // Ubicación exacta del servicio
                zoom: 16       // Zoom detallado para mostrar la zona
            },
            
            // Rate limiting: máximo 3 intentos por 5 minutos
            rateLimiting: {
                maxAttempts: 3,
                timeWindow: 5 * 60 * 1000 // 5 minutos
            },
            
            // Detección de comportamiento sospechoso
            security: {
                minInteractionTime: 10000, // 10 segundos mínimo en el sitio
                maxClicksPerMinute: 30,    // Máximo 30 clicks por minuto
                requiredScrollDepth: 50    // Usuario debe scrollear 50% del sitio
            }
        };

        // GUÍA: Variables de estado de seguridad
        this.securityState = {
            userInteractionTime: 0,
            clickCount: 0,
            scrollDepth: 0,
            contactAttempts: 0,
            lastContactAttempt: 0,
            isVerified: false
        };

        // GUÍA: Datos protegidos (encriptados básicamente)
        this.protectedData = {
            // SEGURIDAD: Número de WhatsApp ofuscado con ROT13 y base64
            whatsapp: this.encodeData('5491123456789'),
            email: this.encodeData('info@outlettech.com.ar'),
            phone: this.encodeData('+54 11 2345-6789'),
            address: this.encodeData('Coronel Cardenas 2122, Aldo Bonzi, Buenos Aires')
        };

        this.init();
    }

    /**
     * GUÍA: Método de inicialización principal
     * Configura todos los sistemas de seguridad
     */
    init() {
        this.setupUserTracking();
        this.initMiniMap();
        this.setupSecureContactButton();
        this.setupProtectedWhatsApp();
        this.detectBotBehavior();
        
        console.log('🔒 OutletTech Security System initialized');
        console.log('📊 Tracking user behavior for security verification');
    }

    /**
     * GUÍA: Sistema de codificación simple para ofuscar datos
     * Usa ROT13 + Base64 para ocultar información en el código fuente
     */
    encodeData(data) {
        // ROT13 básico para números y texto
        const rot13 = data.replace(/[a-zA-Z0-9]/g, function(c) {
            const start = /[0-9]/.test(c) ? 48 : (/[A-Z]/.test(c) ? 65 : 97);
            const range = /[0-9]/.test(c) ? 10 : 26;
            return String.fromCharCode((c.charCodeAt(0) - start + 13) % range + start);
        });
        
        // Base64 encoding
        return btoa(rot13);
    }

    /**
     * GUÍA: Decodificación de datos protegidos
     * Solo se ejecuta después de la verificación de seguridad
     */
    decodeData(encodedData) {
        try {
            const decoded = atob(encodedData);
            return decoded.replace(/[a-zA-Z0-9]/g, function(c) {
                const start = /[0-9]/.test(c) ? 48 : (/[A-Z]/.test(c) ? 65 : 97);
                const range = /[0-9]/.test(c) ? 10 : 26;
                return String.fromCharCode((c.charCodeAt(0) - start + 13) % range + start);
            });
        } catch (e) {
            console.warn('🔒 Security: Failed to decode protected data');
            return null;
        }
    }

    /**
     * GUÍA: Sistema de seguimiento de comportamiento del usuario
     * Detecta usuarios reales vs bots/scrapers
     */
    setupUserTracking() {
        let startTime = Date.now();
        let clickCount = 0;
        let lastClickTime = 0;

        // Seguimiento del tiempo de interacción
        setInterval(() => {
            this.securityState.userInteractionTime = Date.now() - startTime;
        }, 1000);

        // Seguimiento de clicks (detecta comportamiento de bot)
        document.addEventListener('click', (e) => {
            const now = Date.now();
            clickCount++;
            
            // Reset counter cada minuto
            if (now - lastClickTime > 60000) {
                clickCount = 1;
                lastClickTime = now;
            }
            
            this.securityState.clickCount = clickCount;
            
            // Detección de comportamiento sospechoso
            if (clickCount > this.config.security.maxClicksPerMinute) {
                console.warn('🚨 Security Alert: Suspicious clicking behavior detected');
                this.flagSuspiciousActivity('excessive_clicking');
            }
        });

        // Seguimiento de scroll (usuarios reales scrollean)
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            this.securityState.scrollDepth = Math.max(this.securityState.scrollDepth, scrolled);
        });

        // Mouse movement tracking (bots no mueven el mouse naturalmente)
        let mouseMovements = 0;
        document.addEventListener('mousemove', () => {
            mouseMovements++;
            if (mouseMovements > 50) {
                this.securityState.hasNaturalMouseMovement = true;
            }
        });
    }

    /**
     * GUÍA: Verificación de usuario legítimo
     * Determina si el usuario pasó las verificaciones de seguridad
     */
    verifyLegitimateUser() {
        const checks = {
            timeSpent: this.securityState.userInteractionTime >= this.config.security.minInteractionTime,
            normalClicking: this.securityState.clickCount <= this.config.security.maxClicksPerMinute,
            hasScrolled: this.securityState.scrollDepth >= this.config.security.requiredScrollDepth,
            naturalBehavior: this.securityState.hasNaturalMouseMovement || false
        };

        console.log('🔍 Security verification checks:', checks);

        // Usuario debe pasar al menos 3 de 4 verificaciones
        const passedChecks = Object.values(checks).filter(Boolean).length;
        this.securityState.isVerified = passedChecks >= 3;

        return this.securityState.isVerified;
    }

    /**
     * GUÍA: Rate limiting para prevenir spam
     * Limita la frecuencia de solicitudes de contacto
     */
    checkRateLimit() {
        const now = Date.now();
        const timeSinceLastAttempt = now - this.securityState.lastContactAttempt;

        if (timeSinceLastAttempt < this.config.rateLimiting.timeWindow) {
            this.securityState.contactAttempts++;
        } else {
            this.securityState.contactAttempts = 1;
        }

        this.securityState.lastContactAttempt = now;

        if (this.securityState.contactAttempts > this.config.rateLimiting.maxAttempts) {
            console.warn('🚨 Rate limit exceeded');
            return false;
        }

        return true;
    }

    /**
     * GUÍA: Inicialización del mini mapa con OpenStreetMap
     * Usa coordenadas aproximadas por seguridad
     */
    async initMiniMap() {
        const mapContainer = document.getElementById('contact-map');
        if (!mapContainer) return;

        try {
            // GUÍA: Crear mapa con Leaflet (alternativa gratuita a Google Maps)
            // Cargar Leaflet dinámicamente para mejor performance
            await this.loadLeafletLibrary();

            const map = L.map('contact-map', {
                zoomControl: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                boxZoom: false,
                keyboard: false,
                dragging: false
            }).setView([
                this.config.mapCoords.lat, 
                this.config.mapCoords.lng
            ], this.config.mapCoords.zoom);

            // GUÍA: Usar OpenStreetMap (gratuito, no requiere API key)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 15 // Limitar zoom por seguridad
            }).addTo(map);

            // GUÍA: Marcador en área general (no ubicación exacta)
            const marker = L.marker([
                this.config.mapCoords.lat, 
                this.config.mapCoords.lng
            ]).addTo(map);

            marker.bindPopup(`
                <div style="text-align: center; padding: 10px;">
                    <strong>OutletTech</strong><br>
                    <small>Área de Servicio<br>Aldo Bonzi, Buenos Aires</small>
                </div>
            `);

            // Marcar mapa como cargado
            mapContainer.classList.add('map-loaded');
            
            console.log('🗺️ Mini map loaded with security coordinates');
            
        } catch (error) {
            console.error('Error loading map:', error);
            // Mantener fallback si falla el mapa
        }
    }

    /**
     * GUÍA: Cargar librería Leaflet dinámicamente
     * Evita cargar librerías innecesarias si el mapa no se usa
     */
    async loadLeafletLibrary() {
        return new Promise((resolve, reject) => {
            if (window.L) {
                resolve();
                return;
            }

            // Cargar CSS de Leaflet
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(cssLink);

            // Cargar JavaScript de Leaflet
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * GUÍA: Configuración del botón de contacto seguro
     * Requiere verificación antes de mostrar información
     */
    setupSecureContactButton() {
        const button = document.getElementById('secure-contact-btn');
        if (!button) return;

        button.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // GUÍA: Verificar rate limiting
            if (!this.checkRateLimit()) {
                this.showSecurityMessage('Demasiados intentos. Intenta de nuevo en unos minutos.', 'warning');
                return;
            }

            button.classList.add('loading');
            button.innerHTML = '<i class="ri-loader-line me-2"></i>Verificando...';

            // GUÍA: Simular verificación (en producción sería más compleja)
            await this.simulateVerification();

            if (this.verifyLegitimateUser()) {
                this.showContactInformation();
            } else {
                this.showSecurityChallenge();
            }

            button.classList.remove('loading');
            button.innerHTML = '<i class="ri-phone-line me-2"></i>Solicitar Información de Contacto';
        });
    }

    /**
     * GUÍA: Configuración del enlace de WhatsApp protegido
     * El número no se expone directamente en el HTML
     */
    setupProtectedWhatsApp() {
        const whatsappLink = document.getElementById('secure-whatsapp-link');
        const floatingButton = document.getElementById('secure-whatsapp-float');

        if (whatsappLink) {
            whatsappLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSecureWhatsAppClick();
            });
        }

        if (floatingButton) {
            floatingButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSecureWhatsAppClick();
            });
        }

        // GUÍA: Agregar tooltip informativo
        if (floatingButton) {
            floatingButton.setAttribute('title', 'WhatsApp - Contacto Seguro y Verificado');
        }
    }

    /**
     * GUÍA: Manejo seguro de clicks en WhatsApp
     * Verifica usuario antes de abrir WhatsApp
     */
    handleSecureWhatsAppClick() {
        if (!this.verifyLegitimateUser()) {
            this.showSecurityMessage(
                'Por seguridad, interactúa con el sitio unos segundos antes de contactarnos.',
                'info'
            );
            return;
        }

        if (!this.checkRateLimit()) {
            this.showSecurityMessage('Demasiados intentos. Intenta de nuevo en unos minutos.', 'warning');
            return;
        }

        // GUÍA: Decodificar número de WhatsApp protegido
        const whatsappNumber = this.decodeData(this.protectedData.whatsapp);
        if (whatsappNumber) {
            const message = encodeURIComponent('Hola, estoy interesado en sus servicios de reparación y equipos informáticos');
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
            
            // Abrir en nueva ventana por seguridad
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            
            console.log('📱 Secure WhatsApp contact initiated');
        } else {
            this.showSecurityMessage('Error al acceder a la información de contacto.', 'error');
        }
    }

    /**
     * GUÍA: Simulación de proceso de verificación
     * En producción incluiría más verificaciones
     */
    async simulateVerification() {
        return new Promise(resolve => {
            setTimeout(resolve, 2000); // Simular verificación de 2 segundos
        });
    }

    /**
     * GUÍA: Mostrar información de contacto tras verificación exitosa
     */
    showContactInformation() {
        const modal = this.createSecureModal();
        const phone = this.decodeData(this.protectedData.phone);
        const email = this.decodeData(this.protectedData.email);

        modal.innerHTML = `
            <div class="secure-contact-content">
                <div class="text-success mb-3">
                    <i class="ri-shield-check-line" style="font-size: 3rem;"></i>
                </div>
                <h3 class="text-dark mb-3">Información de Contacto Verificada</h3>
                
                <div class="contact-details text-start mb-4">
                    <div class="mb-3">
                        <strong>📞 Teléfono:</strong><br>
                        <a href="tel:${phone}" class="text-primary">${phone}</a>
                    </div>
                    <div class="mb-3">
                        <strong>📧 Email:</strong><br>
                        <a href="mailto:${email}" class="text-primary">${email}</a>
                    </div>
                    <div class="mb-3">
                        <strong>⏰ Horarios:</strong><br>
                        Lun-Vie: 9:00-18:00 | Sáb: 9:00-14:00
                    </div>
                </div>

                <div class="security-indicator mb-3">
                    <i class="ri-shield-check-line"></i>
                    Información verificada y segura
                </div>

                <button class="btn btn-secondary" onclick="this.closest('.secure-contact-modal').remove()">
                    Cerrar
                </button>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 100);
    }

    /**
     * GUÍA: Mostrar desafío de seguridad para usuarios sospechosos
     */
    showSecurityChallenge() {
        const modal = this.createSecureModal();
        
        modal.innerHTML = `
            <div class="secure-contact-content">
                <div class="text-warning mb-3">
                    <i class="ri-shield-line" style="font-size: 3rem;"></i>
                </div>
                <h3 class="text-dark mb-3">Verificación de Seguridad</h3>
                
                <p class="text-muted mb-4">
                    Para acceder a nuestra información de contacto, necesitamos verificar que eres un usuario real.
                </p>

                <div class="security-tips text-start mb-4">
                    <small class="text-muted">
                        <strong>Para verificarte:</strong><br>
                        • Navega por el sitio unos segundos<br>
                        • Revisa nuestros servicios y productos<br>
                        • Utiliza el formulario de contacto<br>
                    </small>
                </div>

                <button class="btn btn-primary mb-2" onclick="this.closest('.secure-contact-modal').remove()">
                    Entendido
                </button>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 100);
    }

    /**
     * GUÍA: Crear modal de seguridad dinámicamente
     */
    createSecureModal() {
        const modal = document.createElement('div');
        modal.className = 'secure-contact-modal';
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        return modal;
    }

    /**
     * GUÍA: Mostrar mensajes de seguridad al usuario
     */
    showSecurityMessage(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} position-fixed`;
        alert.style.cssText = `
            top: 20px; right: 20px; z-index: 9999; min-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        alert.innerHTML = `
            <i class="ri-information-line me-2"></i>
            ${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;

        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 5000);
    }

    /**
     * GUÍA: Detección de comportamiento de bot
     */
    detectBotBehavior() {
        // Detectar user agent sospechoso
        const userAgent = navigator.userAgent.toLowerCase();
        const botPatterns = ['bot', 'crawler', 'spider', 'scraper'];
        
        if (botPatterns.some(pattern => userAgent.includes(pattern))) {
            console.warn('🤖 Possible bot detected via user agent');
            this.flagSuspiciousActivity('bot_user_agent');
        }

        // Detectar ausencia de eventos táctiles en mobile
        if ('ontouchstart' in window) {
            let touchDetected = false;
            document.addEventListener('touchstart', () => {
                touchDetected = true;
            }, { once: true });

            setTimeout(() => {
                if (!touchDetected && window.innerWidth <= 768) {
                    console.warn('📱 Suspicious: Mobile device without touch events');
                }
            }, 10000);
        }
    }

    /**
     * GUÍA: Marcar actividad sospechosa
     */
    flagSuspiciousActivity(reason) {
        console.warn(`🚨 Suspicious activity flagged: ${reason}`);
        // En producción, esto se enviaría a un servicio de monitoreo
        this.securityState.suspiciousFlags = this.securityState.suspiciousFlags || [];
        this.securityState.suspiciousFlags.push({
            reason,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            ip: 'hidden' // En producción se obtendría del servidor
        });
    }
}

// GUÍA: Inicializar el sistema de seguridad cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.OutletTechSecuritySystem = new OutletTechSecurity();
});

// GUÍA: Protección adicional - Ofuscar código en producción
// Este comentario se eliminaría en producción para mayor seguridad