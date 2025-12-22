import Observer from '../patterns/behavioral/observer/Observer.js';
import AuthService from '../services/AuthService.js';
import NotificationService from '../services/NotificationService.js';
import UserProfileModal from './UserProfileModal.js';

export default class HeaderAuthWidget extends Observer {
    constructor(containerId) {
        super();
        this.container = document.getElementById(containerId);
        this.authService = new AuthService();
        this.profileModal = new UserProfileModal();
        
        this.authService.subscribe(this);
        this.render();
    }

    update(user) {
        this.render();
    }

    render() {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        const user = this.authService.getUser();
        
        if (user) {
            const btnGroup = document.createElement('div');
            btnGroup.style.display = 'flex';
            btnGroup.style.gap = '10px';
            btnGroup.style.alignItems = 'center';

            if (user.role === 'ROLE_ADMIN') {
                const adminBtn = document.createElement('button');
                adminBtn.innerText = '⚙️ Админка';
                adminBtn.className = 'admin-link-btn';
                adminBtn.onclick = () => window.location.href = '/admin.html';
                btnGroup.appendChild(adminBtn);
            }

            const profileBtn = document.createElement('button');
            profileBtn.className = 'profile-btn';
            profileBtn.innerHTML = `
                <div class="avatar-circle">${user.name[0].toUpperCase()}</div>
                <span>${user.name}</span>
            `;
            profileBtn.onclick = () => this.profileModal.open();
            
            btnGroup.appendChild(profileBtn);
            this.container.appendChild(btnGroup);

        } else {
            const loginBtn = document.createElement('button');
            loginBtn.className = 'login-submit-btn'; 
            loginBtn.style.padding = '10px 20px';
            loginBtn.style.marginTop = '0';
            loginBtn.style.width = 'auto';
            loginBtn.innerText = 'Войти';
            loginBtn.onclick = () => this.openLoginModal();
            this.container.appendChild(loginBtn);
        }
    }

    openLoginModal() {
        const overlay = document.createElement('div');
        overlay.className = 'auth-overlay visible';
        
        // Исправление: Добавлены autocomplete и type="button"
        overlay.innerHTML = `
            <div class="auth-modal visible" onclick="event.stopPropagation()">
                <div class="auth-header">
                    <h3>Вход</h3>
                    <button class="auth-close">&times;</button>
                </div>
                
                <div class="input-group">
                    <label>Email</label>
                    <input type="email" id="modal-email" class="modal-input" placeholder="example@mail.com" autocomplete="username">
                </div>
                <div class="input-group">
                    <label>Пароль</label>
                    <input type="password" id="modal-password" class="modal-input" placeholder="******" autocomplete="current-password">
                </div>

                <div id="login-error-msg" style="color:red; text-align:center; font-size:13px; margin-top:10px; display:none;">
                    Неверный Email или пароль
                </div>

                <button id="modal-submit" type="button" class="login-submit-btn" style="margin-top: 20px;">Войти</button>
                
                <p id="register-link" class="auth-footer-text" style="cursor:pointer; text-decoration: underline; margin-top: 15px;">
                   Нет аккаунта? Зарегистрироваться
                </p>
            </div>
        `;

        this._setupModalEvents(overlay, 'login');
    }

    openRegisterModal() {
        const overlay = document.createElement('div');
        overlay.className = 'auth-overlay visible';
        
        // Исправление: Добавлены autocomplete и type="button"
        overlay.innerHTML = `
            <div class="auth-modal visible" onclick="event.stopPropagation()">
                <div class="auth-header">
                    <h3>Регистрация</h3>
                    <button class="auth-close">&times;</button>
                </div>
                
                <div class="input-group">
                    <label>Имя пользователя *</label>
                    <input type="text" id="reg-name" class="modal-input" placeholder="Иван" autocomplete="name">
                </div>
                <div class="input-group">
                    <label>Email *</label>
                    <input type="email" id="reg-email" class="modal-input" placeholder="mail@example.com" autocomplete="email">
                </div>
                <div class="input-group">
                    <label>Пароль * (мин. 6 символов)</label>
                    <input type="password" id="reg-password" class="modal-input" placeholder="******" autocomplete="new-password">
                </div>
                <div class="input-group">
                    <label>Телефон</label>
                    <input type="tel" id="reg-phone" class="modal-input" placeholder="+375 (XX) XXX-XX-XX" value="+375" autocomplete="tel">
                </div>
                <div class="input-group">
                    <label>Адрес</label>
                    <input type="text" id="reg-address" class="modal-input" placeholder="Город, улица..." autocomplete="street-address">
                </div>

                <button id="modal-submit-reg" type="button" class="login-submit-btn" style="margin-top: 20px;">Зарегистрироваться</button>
                
                <p id="login-link" class="auth-footer-text" style="cursor:pointer; text-decoration: underline; margin-top: 15px;">
                   Уже есть аккаунт? Войти
                </p>
            </div>
        `;

        this._setupModalEvents(overlay, 'register');
    }

    _setupModalEvents(overlay, type) {
        document.body.appendChild(overlay);

        const close = () => overlay.remove();

        // Закрытие по фону
        overlay.onclick = (e) => { 
            if(e.target === overlay) close(); 
        };
        // Закрытие по крестику
        overlay.querySelector('.auth-close').onclick = (e) => {
            e.preventDefault();
            close();
        };

        // ================== ЛОГИКА ВХОДА ==================
        if (type === 'login') {
            overlay.querySelector('#register-link').onclick = () => { overlay.remove(); this.openRegisterModal(); };
            
            const submitBtn = overlay.querySelector('#modal-submit');
            const emailInput = overlay.querySelector('#modal-email');
            const passInput = overlay.querySelector('#modal-password');
            const errorMsg = overlay.querySelector('#login-error-msg');

            submitBtn.onclick = async (e) => {
                e.preventDefault(); // <--- ГЛАВНОЕ ИСПРАВЛЕНИЕ: ОТМЕНЯЕМ ПЕРЕЗАГРУЗКУ

                // Сброс ошибок
                this._clearError(emailInput);
                this._clearError(passInput);
                errorMsg.style.display = 'none';

                let isValid = true;
                if (!emailInput.value.includes('@')) {
                    this._showError(emailInput); isValid = false;
                }
                if (!passInput.value) {
                    this._showError(passInput); isValid = false;
                }

                if (!isValid) return;

                // Блокируем кнопку
                const originalText = submitBtn.innerText;
                submitBtn.innerText = 'Вход...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';

                try {
                    const success = await this.authService.login(emailInput.value, passInput.value);
                    
                    if (success) {
                        NotificationService.show('Вход выполнен!', 'success');
                        close(); // Закрываем ТОЛЬКО если логин успешен
                    } else {
                        // Если ошибка - трясем поля и пишем текст
                        this._showError(emailInput);
                        this._showError(passInput);
                        errorMsg.style.display = 'block';
                        errorMsg.innerText = 'Неверный Email или пароль';
                    }
                } catch (e) {
                    errorMsg.style.display = 'block';
                    errorMsg.innerText = 'Ошибка сервера';
                } finally {
                    // Всегда возвращаем кнопку в рабочее состояние
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }
            };
        } 
        
        // ================== ЛОГИКА РЕГИСТРАЦИИ ==================
        else if (type === 'register') {
            overlay.querySelector('#login-link').onclick = () => { overlay.remove(); this.openLoginModal(); };

            const phoneInput = overlay.querySelector('#reg-phone');
            // Маска телефона
            phoneInput.addEventListener('input', (e) => {
                let val = e.target.value.replace(/\D/g, '');
                if (e.inputType === "deleteContentBackward") return;
                if (val.startsWith('375')) {
                    let formatted = '+375';
                    if (val.length > 3) formatted += ' (' + val.substring(3, 5);
                    if (val.length > 5) formatted += ') ' + val.substring(5, 8);
                    if (val.length > 8) formatted += '-' + val.substring(8, 10);
                    if (val.length > 10) formatted += '-' + val.substring(10, 14);
                    e.target.value = formatted;
                } else {
                    e.target.value = '+' + val;
                }
            });

            const submitBtn = overlay.querySelector('#modal-submit-reg');
            
            submitBtn.onclick = async (e) => {
                e.preventDefault(); // <--- ИСПРАВЛЕНИЕ

                const nameInp = overlay.querySelector('#reg-name');
                const emailInp = overlay.querySelector('#reg-email');
                const passInp = overlay.querySelector('#reg-password');
                const phoneInp = overlay.querySelector('#reg-phone');
                const addrInp = overlay.querySelector('#reg-address');

                [nameInp, emailInp, passInp, phoneInp, addrInp].forEach(i => this._clearError(i));
                let isValid = true;
                const emailRegex = /^[a-zA-Z0-9._-]+@(gmail\.com|mail\.ru|yandex\.ru|yandex\.by|bk\.ru|inbox\.ru|list\.ru|icloud\.com|yahoo\.com|outlook\.com)$/;
                
                const cleanPhone = phoneInp.value.replace(/[^\d+]/g, ''); 
                if (!cleanPhone.startsWith('+375') || cleanPhone.length < 13) {
                    this._showError(phoneInp); isValid = false;
                }
                if (nameInp.value.length < 2) { this._showError(nameInp); isValid = false; }
                if (!emailRegex.test(emailInp.value.toLowerCase())) { 
                    this._showError(emailInp); 
                    NotificationService.show('Разрешены только популярные почты (gmail, yandex, mail.ru...)', 'error');
                    isValid = false; 
                } 
                if (passInp.value.length < 6) { this._showError(passInp); isValid = false; }
                if (addrInp.value.length < 3) { this._showError(addrInp); isValid = false; }

                if (!isValid) {
                    NotificationService.show('Проверьте введенные данные', 'error');
                    return;
                }

                submitBtn.disabled = true;
                submitBtn.innerText = 'Регистрация...';

                const userData = {
                    username: nameInp.value,
                    email: emailInp.value,
                    password: passInp.value,
                    phone: cleanPhone,
                    address: addrInp.value
                };

                try {
                    const success = await this.authService.register(userData);
                    if (success) {
                        NotificationService.show('Успешно! Теперь войдите.', 'success');
                        overlay.remove(); 
                        this.openLoginModal(); 
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Зарегистрироваться';
                }
            };
        }
    }

    _showError(input) {
        input.style.borderColor = '#e74c3c';
        input.classList.add('shake-anim');
        setTimeout(() => input.classList.remove('shake-anim'), 500);
    }

    _clearError(input) {
        input.style.borderColor = '#ccc';
        input.classList.remove('shake-anim');
    }
}