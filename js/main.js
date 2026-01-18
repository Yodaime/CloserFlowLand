// ============================================
// MAIN JAVASCRIPT - CloserFlow Landing Page
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Acessibilidade: atualizar aria-expanded
            const isExpanded = navMenu.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Fechar outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Alternar item atual
            item.classList.toggle('active');
            
            // Acessibilidade: atualizar aria-expanded
            const isExpanded = item.classList.contains('active');
            question.setAttribute('aria-expanded', isExpanded);
        });
        
        // Suporte a teclado
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
    
    // Smooth Scroll para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorar links que não são âncora
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form Submission Handler
    const demoForm = document.getElementById('demoForm');
    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                company: document.getElementById('company').value,
                stores: document.getElementById('stores').value,
                challenge: document.getElementById('challenge').value,
                timestamp: new Date().toISOString()
            };
            
            // Validação básica (validação completa em form-validation.js)
            if (!validateFormData(formData)) {
                return;
            }
            
            // Simular envio para API
            simulateFormSubmission(formData);
        });
    }
    
    // Animações de entrada (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.pain-card, .solution-card, .metric-large, .benefit');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Contador de tempo na página para analytics
    let pageStartTime = Date.now();
    
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - pageStartTime) / 1000);
        console.log(`Tempo gasto na página: ${timeSpent} segundos`);
        // Aqui você enviaria para seu sistema de analytics
    });
    
    // Helper Functions
    function validateFormData(data) {
        // Validação básica
        const requiredFields = ['name', 'email', 'phone', 'company', 'stores', 'challenge'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                isValid = false;
                highlightError(field);
            }
        });
        
        // Validação de email
        if (data.email && !isValidEmail(data.email)) {
            isValid = false;
            highlightError('email');
        }
        
        return isValid;
    }
    
    function highlightError(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = 'var(--danger)';
            field.focus();
            
            // Remover highlight após 3 segundos
            setTimeout(() => {
                field.style.borderColor = '';
            }, 3000);
        }
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function simulateFormSubmission(data) {
        // Mostrar estado de carregamento
        const submitBtn = demoForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simular delay de rede
        setTimeout(() => {
            // Em produção, aqui você faria uma requisição para sua API
            console.log('Dados do formulário:', data);
            
            // Mostrar mensagem de sucesso
            showSuccessMessage();
            
            // Resetar formulário
            demoForm.reset();
            
            // Restaurar botão
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Rolar para cima para mostrar a mensagem
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 1500);
    }
    
    function showSuccessMessage() {
        // Criar elemento de mensagem
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <div>
                    <h4>Agendamento enviado com sucesso!</h4>
                    <p>Entraremos em contato em até 24 horas para confirmar sua demonstração.</p>
                </div>
                <button class="close-message">&times;</button>
            </div>
        `;
        
        // Estilos inline para a mensagem
        message.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        const successContent = message.querySelector('.success-content');
        successContent.style.cssText = `
            display: flex;
            align-items: flex-start;
            gap: 15px;
        `;
        
        // Adicionar ao DOM
        document.body.appendChild(message);
        
        // Botão de fechar
        const closeBtn = message.querySelector('.close-message');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        `;
        
        closeBtn.addEventListener('click', () => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => message.remove(), 300);
        });
        
        // Remover automaticamente após 10 segundos
        setTimeout(() => {
            if (document.body.contains(message)) {
                message.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => message.remove(), 300);
            }
        }, 10000);
        
        // Adicionar keyframes para animação
        if (!document.querySelector('#message-styles')) {
            const style = document.createElement('style');
            style.id = 'message-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Inicializar contadores (se houver)
    initializeCounters();
});

// Funções globais adicionais
function initializeCounters() {
    // Esta função pode ser usada para animar números contadores
    const counters = document.querySelectorAll('.stat-number, .metric-value');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
        if (!isNaN(target) && target > 0) {
            animateCounter(counter, target);
        }
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 20);
}

// Suporte para navegadores mais antigos
if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.msMatchesSelector || 
        Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}