import Subject from '../patterns/behavioral/observer/Subject.js';
import ApiClient from '../core/ApiClient.js';
import NotificationService from './NotificationService.js'; // <-- Импортируем сервис
import CartService from './CartService.js';


export default class AuthService extends Subject {
    constructor() {
        super();
        if (AuthService.instance) {
            return AuthService.instance;
        }
        AuthService.instance = this;
        
        this.api = new ApiClient();
        
        // Восстанавливаем сессию из localStorage при перезагрузке страницы
        this.token = localStorage.getItem('jwt_token');
        this.user = JSON.parse(localStorage.getItem('user_data'));
    }

    /**
     * Вход по Email и Паролю
     */
    async login(email, password) {
        console.log(`[AuthService] Logging in as ${email}...`);

        try {
            const response = await this.api.post('/auth/login', {
                email: email,
                password: password
            });

            if (response && response.token) {
                this._setSession(response);
                return true;
            }
        } catch (error) {
            console.error("Login failed:", error);
            // ЗАМЕНЯЕМ alert() НА NotificationService.show()
            // Старое: alert("Ошибка входа: " + error.message);
            NotificationService.show("Ошибка входа: " + error.message, 'error');
            return false;
        }
    }

    async register(userData) {
        console.log(`[AuthService] Registering user...`);
        try {
            await this.api.post('/auth/register', userData);
            return true;
        } catch (error) {
            console.error("Registration failed:", error);
            // ЗАМЕНЯЕМ alert()
            // Старое: alert("Ошибка регистрации: " + error.message);
            NotificationService.show("Ошибка регистрации: " + error.message, 'error');
            return false;
        }
    }

 logout(shouldReload = true) {
        this.token = null;
        this.user = null;
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');
        
        // Очищаем корзину
        import('./CartService.js').then(module => {
             const cartService = module.default.instance;
             if (cartService) cartService.clearCart();
        });

        this.notify(null); 
        console.log("[AuthService] User logged out.");
        
        // Перезагружаем только если нужно
        if (shouldReload) {
            window.location.reload();
        }
    }

    _setSession(authResponse) {
        this.token = authResponse.token;
        
        this.user = {
            id: authResponse.id,
            name: authResponse.username,
            role: authResponse.role
        };

        localStorage.setItem('jwt_token', this.token);
        localStorage.setItem('user_data', JSON.stringify(this.user));

        this.notify(this.user); // Уведомляем подписчиков, что юзер вошел
    }

    getUser() {
        return this.user;
    }

    isLoggedIn() {
        return !!this.token;
    }
}