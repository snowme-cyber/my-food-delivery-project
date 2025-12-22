import Observer from '../patterns/behavioral/observer/Observer.js';
import AuthService from '../services/AuthService.js';
import NotificationService from '../services/NotificationService.js';
import CartService from '../services/CartService.js'; 

export default class CartWidget extends Observer {
    constructor(containerId) {
        super();
        this.container = document.getElementById(containerId);
        
        // Ссылка на сервис (получаем singleton)
        const cartService = new CartService(); 

        if (!this.container) {
            console.error(`CartWidget: Контейнер #${containerId} не найден!`);
            return;
        }

        // --- ИСПРАВЛЕНИЕ: Рендерим текущее состояние сервиса, а не нули ---
        this.render(cartService.getCurrentState());
    }

    update(cartState) {
        this.render(cartState);
    }

    render(state) {
        if (!this.container) return;

        this.container.innerHTML = '';
        
        const btn = document.createElement('button');
        btn.className = 'cart-button';
        
        // Форматируем цену (защита если пришло число или строка)
        const price = state.totalPrice ? parseFloat(state.totalPrice).toFixed(2) : '0.00';

        // Если товаров > 0, меняем стиль
        if (state.totalCount > 0) {
            btn.style.background = '#FCE000';
            btn.innerHTML = `
                <span>🛒</span>
                <span>${price} BYN</span>
            `;
        } else {
            btn.style.background = '#F5F4F2';
            btn.innerHTML = `<span>Корзина</span>`;
        }

        // Клик с проверкой авторизации
        btn.onclick = () => {
            if (!AuthService.instance.isLoggedIn()) {
                NotificationService.show('Пожалуйста, войдите в систему', 'info');
                const loginBtn = document.querySelector('.login-submit-btn');
                if (loginBtn) loginBtn.click();
                return;
            }
            document.dispatchEvent(new CustomEvent('toggle-cart-sidebar'));
        };

        // Анимация
        if (state.totalCount > 0) {
            btn.classList.add('bump');
            setTimeout(() => btn.classList.remove('bump'), 300);
        }

        this.container.appendChild(btn);
    }
}