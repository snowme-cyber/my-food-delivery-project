import VisualComponent from '../patterns/structural/decorator/Component.js';
import AuthService from '../services/AuthService.js';

export default class AuthModal extends VisualComponent {
    constructor() {
        super();
        this.authService = new AuthService();
        this.overlay = null;
        this.container = null;
    }

    render() {
        // Если уже создано, не пересоздаем
        if (this.overlay) return this.overlay;

        // 1. Overlay (затемнение)
        this.overlay = document.createElement('div');
        this.overlay.className = 'auth-overlay hidden';
        
        // 2. Container (само окно)
        this.container = document.createElement('div');
        this.container.className = 'auth-modal';
        
        this.container.innerHTML = `
            <div class="auth-header">
                <h3>Вход на сайт</h3>
                <button class="auth-close">&times;</button>
            </div>
            
            <div class="auth-body">
                <p class="auth-description">Укажите номер телефона, чтобы войти или зарегистрироваться</p>
                
                <div class="input-group">
                    <label>Номер телефона</label>
                    <div class="input-wrapper">
                        <span class="country-code">🇷🇺 +7</span>
                        <input type="tel" id="phone-input" placeholder="(000) 000-00-00" maxlength="15">
                    </div>
                </div>

                <button class="primary-btn login-submit-btn">
                    <span>Выслать код</span>
                </button>
                
                <p class="auth-footer-text">
                    Нажимая кнопку, вы соглашаетесь с условиями сервиса и политикой конфиденциальности.
                </p>
            </div>
        `;

        this.overlay.appendChild(this.container);
        document.body.appendChild(this.overlay);

        this._bindEvents();

        return this.overlay;
    }

    open() {
        this.render(); // Гарантируем, что DOM есть
        this.overlay.classList.remove('hidden');
        // Небольшой таймаут для CSS анимации
        setTimeout(() => {
            this.container.classList.add('visible');
            document.getElementById('phone-input').focus();
        }, 10);
    }

    close() {
        if (!this.container) return;
        this.container.classList.remove('visible');
        setTimeout(() => {
            this.overlay.classList.add('hidden');
        }, 300);
    }

    _bindEvents() {
        const closeBtn = this.container.querySelector('.auth-close');
        const submitBtn = this.container.querySelector('.login-submit-btn');
        const input = this.container.querySelector('#phone-input');

        // Закрытие
        closeBtn.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        // Форматирование телефона (простая маска)
        input.addEventListener('input', (e) => {
            // Удаляем все нецифровые символы
            const x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            if (x) {
                e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '') + (x[4] ? '-' + x[4] : '');
            }
        });

        // Сабмит
        submitBtn.addEventListener('click', async () => {
            const phone = input.value;
            
            if (phone.length < 10) {
                this._showError(input);
                return;
            }

            // Анимация загрузки на кнопке
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loader"></span>';
            submitBtn.disabled = true;
            
        try {
            await this.authService.login(phone);
            this.close(); // Успех
        } catch (e) {
            // Ошибку покажет NotificationService внутри authService, 
            // но нам нужно вернуть кнопку в исходное состояние
        } finally {
            // ИСПРАВЛЕНИЕ: Всегда возвращаем кнопку, даже при ошибке
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
            // Успех
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.close();
        });
    }

    _showError(inputElement) {
        const wrapper = inputElement.closest('.input-wrapper');
        wrapper.classList.add('error');
        setTimeout(() => wrapper.classList.remove('error'), 500); // Анимация тряски
    }
}
