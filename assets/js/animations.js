/**
 * ===== OUTLETTECH - SISTEMA DE ANIMACIONES PERSONALIZADO =====
 * 
 * TRAINEE NOTE: Sistema moderno de animaciones usando Intersection Observer
 * Reemplaza AOS con un sistema más flexible y personalizable
 * 
 * CARACTERÍSTICAS:
 * - Más liviano que AOS
 * - Animaciones específicas por sección
 * - Mejor rendimiento con Intersection Observer
 * - Animaciones personalizadas por tipo de elemento
 */

class OutletTechAnimations {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
        } else {
            this.setupAnimations();
        }
    }

    setupAnimations() {
        // Configurar diferentes tipos de animaciones
        this.setupIntersectionObserver();
        this.setupHeroAnimations();
        this.setupSectionAnimations();
        this.setupStaggerAnimations();
        
        console.log('🚀 OutletTech Animations System initialized');
    }

    setupIntersectionObserver() {
        // Configuración del observador principal
        const options = {
            root: null,
            rootMargin: '0px 0px -10% 0px', // Activar cuando el elemento esté 10% visible
            threshold: [0.1, 0.3, 0.6] // Múltiples puntos de activación
        };

        this.mainObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => this.handleIntersection(entry));
        }, options);

        // Observar todos los elementos con clases de animación
        const animatedElements = document.querySelectorAll(`
            .animate-on-scroll,
            .animate-fade-in,
            .animate-slide-left,
            .animate-slide-right,
            .animate-scale-up,
            .animate-zoom-in,
            .animate-stagger
        `);

        animatedElements.forEach(element => {
            this.mainObserver.observe(element);
        });
    }

    handleIntersection(entry) {
        const element = entry.target;
        const elementId = element.getAttribute('id') || element.className;

        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            // Elemento entra en vista
            if (!this.animatedElements.has(element)) {
                this.animateElement(element);
                this.animatedElements.add(element);
            }
        }
    }

    animateElement(element) {
        // Determinar tipo de animación basado en la sección
        const section = element.closest('section');
        const sectionId = section ? section.getAttribute('id') : '';

        // Aplicar animación específica según la sección
        switch (sectionId) {
            case 'hero':
                this.animateHeroElement(element);
                break;
            case 'about':
                this.animateAboutElement(element);
                break;
            case 'services':
                this.animateServicesElement(element);
                break;
            case 'products':
                this.animateProductsElement(element);
                break;
            case 'contact':
                this.animateContactElement(element);
                break;
            default:
                this.animateDefaultElement(element);
        }
    }

    animateHeroElement(element) {
        // Hero: Animación de aparición con escala y fade
        element.classList.add('animate-visible');
        
        if (element.classList.contains('home-logo')) {
            // Logo especial: rotación + escala
            element.style.animation = 'heroLogoEntry 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        } else if (element.classList.contains('display-2')) {
            // Título principal: typing effect
            this.typewriterEffect(element);
        }
    }

    animateAboutElement(element) {
        // About: Slide desde la izquierda
        element.classList.add('animate-visible');
        element.style.animation = 'slideInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }

    animateServicesElement(element) {
        // Servicios: Stagger effect para las cards
        const serviceItems = element.querySelectorAll('.service-item');
        
        serviceItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate-visible');
                item.style.animation = 'bounceInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }, index * 150); // Delay progresivo
        });

        if (serviceItems.length === 0) {
            // Es el elemento contenedor
            element.classList.add('animate-visible');
        }
    }

    animateProductsElement(element) {
        // Productos: Zoom in con rotación
        const productCards = element.querySelectorAll('.product-card');
        
        productCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-visible');
                card.style.animation = 'zoomInRotate 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, index * 200);
        });

        if (productCards.length === 0) {
            element.classList.add('animate-visible');
        }
    }

    animateContactElement(element) {
        // Contacto: Slide up suave
        element.classList.add('animate-visible');
        element.style.animation = 'slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }

    animateDefaultElement(element) {
        // Animación por defecto
        element.classList.add('animate-visible');
    }

    typewriterEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.opacity = '1';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(typeInterval);
            }
        }, 100);
    }

    setupHeroAnimations() {
        // Crear keyframes dinámicamente para animaciones del hero
        const style = document.createElement('style');
        style.textContent = `
            @keyframes heroLogoEntry {
                0% {
                    opacity: 0;
                    transform: scale(0.3) rotate(-180deg);
                }
                50% {
                    opacity: 0.8;
                    transform: scale(1.1) rotate(-90deg);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) rotate(0deg);
                }
            }

            @keyframes slideInLeft {
                0% {
                    opacity: 0;
                    transform: translateX(-100px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes bounceInUp {
                0% {
                    opacity: 0;
                    transform: translateY(100px) scale(0.8);
                }
                50% {
                    transform: translateY(-20px) scale(1.05);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @keyframes zoomInRotate {
                0% {
                    opacity: 0;
                    transform: scale(0.5) rotateY(45deg);
                }
                50% {
                    opacity: 0.8;
                    transform: scale(1.1) rotateY(22deg);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) rotateY(0deg);
                }
            }

            @keyframes slideInUp {
                0% {
                    opacity: 0;
                    transform: translateY(50px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupSectionAnimations() {
        // Animación especial para el scroll entre secciones
        let currentSection = '';
        
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section');
            const scrollPos = window.scrollY + window.innerHeight / 2;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    if (currentSection !== sectionId) {
                        currentSection = sectionId;
                        this.triggerSectionTransition(sectionId);
                    }
                }
            });
        });
    }

    setupStaggerAnimations() {
        // Configurar animaciones en cascada para grupos de elementos
        const staggerGroups = document.querySelectorAll('.animate-stagger-group');
        
        staggerGroups.forEach(group => {
            const items = group.querySelectorAll('.animate-stagger');
            
            items.forEach((item, index) => {
                item.style.transitionDelay = `${index * 0.1}s`;
            });
        });
    }

    triggerSectionTransition(sectionId) {
        // Efecto de transición específico al entrar a cada sección
        const section = document.getElementById(sectionId);
        if (!section) return;

        section.style.transform = 'scale(1.02)';
        section.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            section.style.transform = 'scale(1)';
        }, 300);

        // Log para debug
        console.log(`🎯 Transición activada: ${sectionId}`);
    }

    // Método público para agregar elementos dinámicamente
    addElement(element) {
        if (this.mainObserver) {
            this.mainObserver.observe(element);
        }
    }

    // Método público para remover elementos
    removeElement(element) {
        if (this.mainObserver) {
            this.mainObserver.unobserve(element);
        }
        this.animatedElements.delete(element);
    }

    // Limpiar observadores al destruir
    destroy() {
        if (this.mainObserver) {
            this.mainObserver.disconnect();
        }
        this.observers.clear();
        this.animatedElements.clear();
    }
}

// Inicializar el sistema de animaciones
window.OutletTechAnimations = new OutletTechAnimations();

// Exponer métodos globales para uso opcional
window.addAnimation = (element) => window.OutletTechAnimations.addElement(element);
window.removeAnimation = (element) => window.OutletTechAnimations.removeElement(element);