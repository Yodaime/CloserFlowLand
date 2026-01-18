// ============================================
// FORM VALIDATION - CloserFlow
// ============================================

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        
        this.fields = {
            name: {
                element: document.getElementById('name'),
                validators: [this.validateRequired, this.validateNameLength]
            },
            email: {
                element: document.getElementById('email'),
                validators: [this.validateRequired, this.validateEmail]
            },
            phone: {
                element: document.getElementById('phone'),
                validators: [this.validateRequired, this.validatePhone]
            },
            company: {
                element: document.getElementById('company'),
                validators: [this.validateRequired]
            },
            stores: {
                element: document.getElementById('stores'),
                validators: [this.validateRequired]
            },
            challenge: {
                element: document.getElementById('challenge'),
                validators: [this.validateRequired, this.validateChallengeLength]
            },
            agree: {
                element: document.getElementById('agree'),
                validators: [this.validateAgreement]
            }
        };
        
        this.init();
    }
    
    init() {
        // Validar em tempo real
        Object.values(this.fields).forEach(field => {
            if (field.element) {
                field.element.addEventListener('blur', () => this.validateField(field));
                field.element.addEventListener('input', () => this.clearError(field));
            }
        });
        
        // Validar no envio
        this.form.addEventListener('submit', (e) => {
            if (!this.validateAll()) {
                e.preventDefault();
                this.showGeneralError();
            }
        });
    }
    
    validateField(field) {
        const value = field.element.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Executar todos os validadores
        for (const validator of field.validators) {
            const result = validator(value, field.element);
            if (result !== true) {
                isValid = false;
                errorMessage = result;
                break;
            }
        }
        
        if (!isValid) {
            this.showError(field, errorMessage);
        } else {
            this.showSuccess(field);
        }
        
        return isValid;
    }
    
    validateAll() {
        let allValid = true;
        
        Object.entries(this.fields).forEach(([fieldName, field]) => {
            if (!this.validateField(field)) {
                allValid = false;
                
                // Rolar até o primeiro erro
                if (allValid === false && field.element) {
                    field.element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    field.element.focus();
                    allValid = null; // Para não rolar novamente
                }
            }
        });
        
        return allValid === true ? true : false;
    }
    
    // Validadores
    validateRequired(value, element) {
        if (!value || value.trim() === '') {
            return 'Este campo é obrigatório';
        }
        return true;
    }
    
    validateNameLength(value, element) {
        if (value.length < 2) {
            return 'Nome deve ter pelo menos 2 caracteres';
        }
        if (value.length > 100) {
            return 'Nome deve ter no máximo 100 caracteres';
        }
        return true;
    }
    
    validateEmail(value, element) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Por favor, insira um email válido';
        }
        return true;
    }
    
    validatePhone(value, element) {
        // Remover todos os caracteres não numéricos
        const phoneNumbers = value.replace(/\D/g, '');
        
        if (phoneNumbers.length < 10) {
            return 'Telefone deve ter pelo menos 10 dígitos';
        }
        
        if (phoneNumbers.length > 15) {
            return 'Telefone muito longo';
        }
        
        return true;
    }
    
    validateChallengeLength(value, element) {
        if (value.length < 10) {
            return 'Por favor, descreva melhor seu desafio';
        }
        if (value.length > 1000) {
            return 'Descrição muito longa (máximo 1000 caracteres)';
        }
        return true;
    }
    
    validateAgreement(value, element) {
        if (!element.checked) {
            return 'Você precisa concordar com os termos';
        }
        return true;
    }
    
    // UI Helpers
    showError(field, message) {
        this.clearError(field);
        
        field.element.classList.add('error');
        
        // Criar elemento de erro
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--danger);
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        // Inserir após o campo
        field.element.parentNode.appendChild(errorElement);
        
        // Adicionar ícone
        const icon = document.createElement('i');
        icon.className = 'fas fa-exclamation-circle';
        errorElement.prepend(icon);
        
        // Focar no campo com erro
        field.element.focus();
    }
    
    showSuccess(field) {
        this.clearError(field);
        field.element.classList.add('success');
    }
    
    clearError(field) {
        field.element.classList.remove('error', 'success');
        
        // Remover mensagens de erro anteriores
        const errorElement = field.element.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    showGeneralError() {
        // Remover mensagens gerais anteriores
        const existingError = document.querySelector('.general-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Criar mensagem geral
        const errorElement = document.createElement('div');
        errorElement.className = 'general-error';
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>Por favor, corrija os erros no formulário antes de enviar.</span>
        `;
        errorElement.style.cssText = `
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid var(--danger);
            color: var(--danger);
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: shake 0.5s ease;
        `;
        
        // Inserir no início do formulário
        this.form.prepend(errorElement);
        
        // Adicionar animação
        if (!document.querySelector('#shake-animation')) {
            const style = document.createElement('style');
            style.id = 'shake-animation';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 5000);
    }
    
    // Formatar telefone automaticamente
    static formatPhoneInput(input) {
        input.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            if (value.length > 0) {
                // Formatar como (XX) XXXXX-XXXX
                let formatted = '(' + value.substring(0, 2);
                if (value.length > 2) {
                    formatted += ') ' + value.substring(2, 7);
                }
                if (value.length > 7) {
                    formatted += '-' + value.substring(7, 11);
                }
                this.value = formatted;
            }
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    const validator = new FormValidator('demoForm');
    
    // Formatar telefone automaticamente
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        FormValidator.formatPhoneInput(phoneInput);
    }
    
    // Máscara para outros campos se necessário
    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            // Permitir apenas letras e espaços
            this.value = this.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
        });
    }
});

// Exportar para uso global (se necessário)
if (typeof window !== 'undefined') {
    window.FormValidator = FormValidator;
}