import AuthService from '../services/AuthService.js';

export default class ApiClient {
    constructor() {
        if (ApiClient.instance) {
            return ApiClient.instance;
        }
        ApiClient.instance = this;
        this.baseUrl = 'http://localhost:8080'; 
    }

    async get(endpoint) {
        return this._request(endpoint, { method: 'GET' });
    }

    async post(endpoint, body) {
        return this._request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    async put(endpoint, body) {
        return this._request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    async delete(endpoint) {
        return this._request(endpoint, { method: 'DELETE' });
    }

     async _request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Берем токен из инстанса или localStorage
        const token = AuthService.instance ? AuthService.instance.token : localStorage.getItem('jwt_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = { ...options, headers };

        try {
            const response = await fetch(url, config);

            // === ИСПРАВЛЕНИЕ ЗДЕСЬ ===
            if (response.status === 401) {
                // Если это попытка входа (/auth/login), НЕ перезагружаем страницу!
                // Просто выбрасываем ошибку, чтобы форма входа могла её обработать (потрясти полями).
                if (endpoint.includes('/auth/login')) {
                    throw new Error('Неверные учетные данные');
                }

                console.warn('Unauthorized! Token might be expired.');
                if (AuthService.instance) AuthService.instance.logout(false); // false = без релоада здесь
                
                // Если мы в админке - кидаем на главную
                if (window.location.pathname.includes('admin')) {
                    window.location.href = '/';
                } else {
                    // Иначе просто обновляем, чтобы сбросить интерфейс
                    window.location.reload();
                }
                throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
            }
            // ==========================

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                if (errorData.error) throw new Error(errorData.error);
                if (errorData.message) throw new Error(errorData.message);

                const validationErrors = Object.values(errorData).join(', ');
                if (validationErrors) {
                    throw new Error(validationErrors);
                }

                throw new Error(`Error ${response.status}`);
            }

            // Обработка пустого ответа (например, от delete)
            const text = await response.text();
            return text ? JSON.parse(text) : null;

        } catch (error) {
            console.error(`[ApiClient] Request failed: ${url}`, error);
            throw error;
        }
    }
}