/**
 * ===== OUTLETTECH - SCRIPT DE INICIALIZACIÓN INMEDIATA =====
 * 
 * Este script se ejecuta inmediatamente para prevenir FOUC
 * y optimizar la carga inicial del sitio
 */

// Función IIFE para prevenir FOUC y optimizar carga inicial
(function() {
    'use strict';
    
    /**
     * Marcar body como cargado cuando el DOM esté listo
     * Esto permite transiciones suaves desde el estado inicial
     */
    function markPageAsLoaded() {
        document.body.classList.add('loaded');
        console.log('🎯 Page loaded - FOUC prevention active');
    }
    
    // Verificar el estado del documento
    if (document.readyState === 'loading') {
        // Si aún está cargando, esperar al DOMContentLoaded
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(markPageAsLoaded, 100);
        });
    } else {
        // Si ya está cargado, ejecutar inmediatamente
        markPageAsLoaded();
    }
    
    /**
     * Optimización de scroll inicial
     * Habilitar smooth scrolling si está disponible
     */
    if ('scrollBehavior' in document.documentElement.style) {
        document.documentElement.style.scrollBehavior = 'smooth';
        console.log('🎯 Smooth scrolling enabled');
    }
    
    /**
     * Optimizaciones de rendimiento tempranas
     */
    
    // Prevenir layout shift en la carga inicial
    if (window.innerHeight) {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
    
    // Listener para actualizaciones de viewport height (móviles)
    window.addEventListener('resize', function() {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }, { passive: true });
    
})();