// Custom JavaScript for OutletTech
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Generar token CSRF al cargar la página
    const formToken = generateToken();
    const tokenInput = document.getElementById('form_token');
    if (tokenInput) {
        tokenInput.value = formToken;
    }
    
    // Registrar tiempo de inicio del formulario
    sessionStorage.setItem('form_start_time', Date.now());

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.spinner-border');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Verificar tiempo mínimo (protección contra bots)
            const startTime = sessionStorage.getItem('form_start_time');
            if (startTime && (Date.now() - parseInt(startTime)) < 3000) {
                showMessage('Por favor, tómate unos segundos más para completar el formulario.', 'danger');
                return;
            }
            
            // Mostrar estado de carga
            setLoadingState(true);
            
            // Validaciones del lado cliente
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();
            
            // Validaciones básicas
            if (!nombre || nombre.length < 2) {
                showMessage('El nombre debe tener al menos 2 caracteres.', 'danger');
                setLoadingState(false);
                return;
            }
            
            if (!email || !isValidEmail(email)) {
                showMessage('Por favor ingresa un email válido.', 'danger');
                setLoadingState(false);
                return;
            }
            
            if (!mensaje || mensaje.length < 10) {
                showMessage('El mensaje debe tener al menos 10 caracteres.', 'danger');
                setLoadingState(false);
                return;
            }
            
            // Verificar contenido spam básico
            const contenido = (nombre + ' ' + email + ' ' + mensaje).toLowerCase();
            const spamWords = ['viagra', 'casino', 'loan', 'bitcoin', 'crypto', 'investment'];
            for (let word of spamWords) {
                if (contenido.includes(word)) {
                    showMessage('El contenido no está permitido.', 'danger');
                    setLoadingState(false);
                    return;
                }
            }
            
            // Enviar formulario via AJAX
            const formData = new FormData(this);
            
            fetch('enviar.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage(data.message, 'success');
                    contactForm.reset();
                    // Generar nuevo token
                    tokenInput.value = generateToken();
                    sessionStorage.setItem('form_start_time', Date.now());
                } else {
                    showMessage(data.message, 'danger');
                }
            })
            .catch(error => {
                showMessage('Error de conexión. Por favor, inténtalo más tarde.', 'danger');
            })
            .finally(() => {
                setLoadingState(false);
            });
        });
    }
    
    // Funciones auxiliares
    function generateToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showMessage(message, type) {
        formMessage.className = `alert alert-${type}`;
        formMessage.textContent = message;
        formMessage.classList.remove('d-none');
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            formMessage.classList.add('d-none');
        }, 5000);
    }
    
    function setLoadingState(loading) {
        if (loading) {
            submitBtn.disabled = true;
            btnText.classList.add('d-none');
            btnSpinner.classList.remove('d-none');
        } else {
            submitBtn.disabled = false;
            btnText.classList.remove('d-none');
            btnSpinner.classList.add('d-none');
        }
    }

    // Add navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.backgroundColor = '';
        }
    });

    // Counter animation
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target') || +counter.innerText;
        const increment = target / 200;
        
        const updateCounter = () => {
            const count = +counter.innerText;
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCounter, 1);
            } else {
                counter.innerText = target;
            }
        };
        
        // Start animation when element is visible
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
});