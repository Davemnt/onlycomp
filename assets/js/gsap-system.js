/**
 * ===== OUTLETTECH - SISTEMA DE ANIMACIONES GSAP =====
 * 
 * Sistema completo de animaciones y navegación con GSAP
 * Incluye detección de navegación, scroll spy y animaciones
 */

class OutletTechGSAP {
    constructor() {
        this.navbar = null;
        this.heroSection = null;
        this.isOutsideHero = false;
        this.hasNavigated = false;
        this.transitionDebouncer = null;
        
        this.init();
    }

    /**
     * Inicialización principal
     */
    init() {
        // Esperar a que todos los scripts defer se carguen
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeGSAP();
        });
    }

    /**
     * Inicializar GSAP cuando esté disponible
     */
    initializeGSAP() {
        if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
            gsap.registerPlugin(ScrollTrigger);
            this.setupAnimations();
            console.log('🎯 GSAP System initialized');
        } else {
            // Reintentar si GSAP no está listo
            setTimeout(() => this.initializeGSAP(), 50);
        }
    }

    /**
     * Configurar todas las animaciones y funcionalidades
     */
    setupAnimations() {
        this.initializeElements();
        this.setupNavbarSystem();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        // this.setupNavigation(); // Deshabilitado - navegación manejada en HTML
    }

    /**
     * Inicializar elementos DOM
     */
    initializeElements() {
        this.navbar = document.getElementById('mainNavbar');
        this.heroSection = document.getElementById('hero');
        
        if (!this.navbar || !this.heroSection) {
            console.warn('🚨 Required elements not found');
            return;
        }
        
        // Aplicar clase preload temporalmente
        this.navbar.classList.add('navbar-preload');
        
        // Remover preload después de la inicialización
        setTimeout(() => {
            this.navbar.classList.remove('navbar-preload');
            // Asegurar que navbar siempre tenga fondo desde el inicio
            this.navbar.classList.add('navbar-scrolled');
        }, 100);
    }

    /**
     * Configurar sistema de navbar con detección de scroll
     */
    setupNavbarSystem() {
        // Observer para detectar cuando salimos del hero
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                // Si el hero NO está visible, activamos el fondo
                this.isOutsideHero = !entry.isIntersecting;
                this.updateNavbarBackground();
            });
        }, {
            threshold: 0.1, // Activar cuando el 10% del hero sea visible
            rootMargin: '-70px 0px 0px 0px' // Compensar altura del navbar
        });

        // Observar el hero section
        heroObserver.observe(this.heroSection);

        // Backup: detección por scroll tradicional
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.isOutsideHero = true;
                this.updateNavbarBackground();
            }
        }, { passive: true });
    }

    /**
     * Actualizar fondo del navbar
     */
    updateNavbarBackground() {
        if (!this.navbar) return;

        // Cancelar transición anterior si existe
        if (this.transitionDebouncer) {
            clearTimeout(this.transitionDebouncer);
        }

        // Aplicar cambio con debounce suave
        this.transitionDebouncer = setTimeout(() => {
            // Navbar siempre activo - fondo sólido permanente
            if (!this.navbar.classList.contains('navbar-scrolled')) {
                this.navbar.classList.add('navbar-scrolled');
                console.log('🎨 Navbar background: ALWAYS ACTIVE');
            }
        }, 10); // Debounce suave de 10ms
    }

    /**
     * Configurar animaciones de scroll con GSAP
     */
    setupScrollAnimations() {
        // ANIMACIONES DE ENTRADA OPTIMIZADAS - HERO SECTION
        gsap.from(".navbar", {duration: 0.6, y: -50, ease: "power2.out"});
        gsap.from("#hero h1", {duration: 0.8, opacity: 0, y: 30, delay: 0.2});
        gsap.from("#hero h3", {duration: 0.8, opacity: 0, y: 20, delay: 0.4});
        gsap.from("#hero .btn", {duration: 0.6, opacity: 0, scale: 0.95, delay: 0.6, stagger: 0.1});
        gsap.from(".product-showcase", {duration: 0.6, opacity: 0, y: 20, delay: 0.8, stagger: 0.05});

        // PRODUCTS SECTION - Animaciones optimizadas
        gsap.from("#portfolio .section-title", {
            scrollTrigger: "#portfolio",
            duration: 0.6,
            opacity: 0,
            y: 30,
            ease: "power2.out"
        });
        gsap.from("#portfolio .product-card", {
            scrollTrigger: "#portfolio",
            duration: 0.5,
            opacity: 0,
            y: 30,
            stagger: 0.1,
            delay: 0.2,
            ease: "power2.out"
        });

        // SERVICES SECTION - Optimizado
        gsap.from("#services .section-title", {
            scrollTrigger: "#services",
            duration: 0.6,
            opacity: 0,
            y: 30,
            ease: "power2.out"
        });
        gsap.from("#services .service", {
            scrollTrigger: "#services",
            duration: 0.5,
            opacity: 0,
            y: 30,
            stagger: 0.08,
            delay: 0.2,
            ease: "power2.out"
        });

        // ABOUT SECTION - Optimizado
        gsap.from("#about .section-title", {
            scrollTrigger: "#about",
            duration: 0.6,
            opacity: 0,
            y: 30,
            ease: "power2.out"
        });
        gsap.from("#about .about-image", {
            scrollTrigger: "#about",
            duration: 0.6,
            opacity: 0,
            x: -50,
            delay: 0.2,
            ease: "power2.out"
        });
        gsap.from("#about h1, #about p, #about .d-flex", {
            scrollTrigger: "#about",
            duration: 0.5,
            opacity: 0,
            x: 50,
            stagger: 0.1,
            delay: 0.3,
            ease: "power2.out"
        });

        // CONTACT SECTION - Optimizado
        gsap.from("#contact .section-title", {
            scrollTrigger: "#contact",
            duration: 0.6,
            opacity: 0,
            y: 30,
            ease: "power2.out"
        });
        gsap.from("#contact .contact-form-section", {
            scrollTrigger: "#contact",
            duration: 0.6,
            opacity: 0,
            x: -30,
            delay: 0.2,
            ease: "power2.out"
        });
        gsap.from("#contact .contact-info-section", {
            scrollTrigger: "#contact",
            duration: 0.6,
            opacity: 0,
            x: 30,
            delay: 0.3,
            ease: "power2.out"
        });
    }

    /**
     * Configurar efectos hover optimizados
     */
    setupHoverEffects() {
        document.querySelectorAll('.product-showcase').forEach((item) => {
            item.addEventListener('mouseenter', function() {
                gsap.to(this, {duration: 0.2, y: -5, scale: 1.02, ease: "power2.out"});
            });
            item.addEventListener('mouseleave', function() {
                gsap.to(this, {duration: 0.2, y: 0, scale: 1, ease: "power2.out"});
            });
        });
    }

    /**
     * Configurar navegación funcional
     */
    setupNavigation() {
        const allNavLinks = document.querySelectorAll('a[href^="#"]');

        allNavLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                console.log('🔗 Navigating to:', targetId, targetElement);

                if (targetElement) {
                    // Marcar navegación para activar fondo navbar
                    this.hasNavigated = true;
                    this.updateNavbarBackground();

                    // Cerrar menú móvil si está abierto
                    const navbarCollapse = document.getElementById('navbarNav');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        try {
                            if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                                bsCollapse.hide();
                            } else {
                                navbarCollapse.classList.remove('show');
                            }
                        } catch (error) {
                            navbarCollapse.classList.remove('show');
                        }
                    }

                    // Forzar animaciones de la sección inmediatamente
                    this.triggerSectionAnimations(targetElement);

                    // Scroll suave con GSAP o fallback nativo
                    const offsetTop = targetElement.offsetTop - 70;
                    
                    // Intentar con GSAP primero
                    if (typeof gsap !== 'undefined' && gsap.to) {
                        gsap.to(window, {
                            duration: 1,
                            scrollTo: offsetTop,
                            ease: "power2.inOut",
                            onComplete: () => {
                                this.triggerSectionAnimations(targetElement);
                            }
                        });
                    } else {
                        // Fallback con navegador nativo
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                        // Trigger animations después de un delay
                        setTimeout(() => {
                            this.triggerSectionAnimations(targetElement);
                        }, 800);
                    }

                    // Actualizar navegación activa inmediatamente
                    this.updateActiveNavigation(targetId);
                }
            });
        });

        // Scroll spy con IntersectionObserver
        this.setupScrollSpy();
    }

    /**
     * Forzar animaciones de una sección específica
     */
    triggerSectionAnimations(section) {
        const elements = section.querySelectorAll('.animate-on-scroll, [data-animate]');
        elements.forEach(el => {
            el.classList.add('animate-visible');
            // Forzar refresh de ScrollTrigger
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        });
    }

    /**
     * Configurar scroll spy
     */
    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-70px 0px -70px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const currentSection = entry.target.id;
                    this.updateActiveNavigation(currentSection);

                    // Control de fondo navbar basado en la sección activa
                    if (currentSection === 'hero') {
                        // En hero, solo activar fondo si hemos navegado manualmente
                        if (!this.hasNavigated) {
                            this.isOutsideHero = false;
                        }
                    } else {
                        // En cualquier otra sección, activar fondo
                        this.isOutsideHero = true;
                        this.hasNavigated = true;
                    }
                    this.updateNavbarBackground();
                }
            });
        }, observerOptions);

        sections.forEach((section) => {
            observer.observe(section);
        });
    }

    /**
     * Actualizar navegación activa
     */
    updateActiveNavigation(activeSection) {
        document.querySelectorAll('.nav-link').forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + activeSection) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Función para scroll suave (método alternativo)
     */
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const offsetTop = element.offsetTop - 70;
            // Usar scrollTo nativo del navegador con animación GSAP
            gsap.to(window, {
                duration: 1.2,
                scrollTo: offsetTop,
                ease: "power3.inOut"
            });
        }
    }
}

// Inicializar el sistema
const outletTechGSAP = new OutletTechGSAP();