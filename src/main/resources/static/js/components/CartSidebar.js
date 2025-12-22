import Observer from '../patterns/behavioral/observer/Observer.js';
import CardPayment from '../patterns/behavioral/strategy/CardPayment.js';
import CashPayment from '../patterns/behavioral/strategy/CashPayment.js';
import CartService from '../services/CartService.js';
import AuthService from '../services/AuthService.js';
import ApiClient from '../core/ApiClient.js';
import NotificationService from '../services/NotificationService.js';

export default class CartSidebar extends Observer {
    constructor() {
        super();
        this.cartService = new CartService();
        this.authService = new AuthService();
        this.api = new ApiClient();
        
        this.paymentStrategy = new CardPayment(); 

        // Запускаем создание HTML
        this.createSidebarDOM();
         // --- ИСПРАВЛЕНИЕ: ДОБАВЛЯЕМ СЛУШАТЕЛЬ СОБЫТИЯ ---
        document.addEventListener('toggle-cart-sidebar', () => {
            // Если шторка открыта - закрываем, если закрыта - открываем
            // Проверяем наличие класса 'open'
            const isOpen = this.sidebar.classList.contains('open');
            this.toggle(!isOpen);
        });
    }

    createSidebarDOM() {
        const overlay = document.createElement('div');
        overlay.className = 'cart-overlay hidden';
        overlay.innerHTML = `
            <div class="cart-sidebar">
                <div class="cart-header">
                    <h2>Мой заказ</h2>
                    <button class="close-cart">✕</button>
                </div>
                
                <!-- ПЕРЕКЛЮЧАТЕЛЬ ДОСТАВКИ -->
                <div style="padding: 10px 20px; background: #fff;">
                    <div style="display:flex; background: #F5F4F2; padding: 4px; border-radius: 12px;">
                        <div class="del-switch active" data-type="COURIER">🏃 Курьером</div>
                        <div class="del-switch" data-type="PICKUP">🏪 Самовывоз</div>
                    </div>
                </div>

                <!-- ПОЛЕ АДРЕСА (Скрывается при самовывозе) -->
                <div class="cart-address-block" id="address-block">
                    <label>Куда везти?</label>
                    <input type="text" id="cart-address" placeholder="Улица, дом, квартира" class="modal-input">
                </div>

                <div class="cart-items-list">
                    <div class="empty-msg">Корзина пуста 😔</div>
                </div>

                <div class="cart-footer">
                    <div class="payment-methods">
                        <h3>Оплата:</h3>
                        <div style="display: flex; gap: 10px;">
                            <label class="payment-option">
                                <input type="radio" name="payment" value="CARD" checked> 
                                <span>💳 Картой</span>
                            </label>
                            <label class="payment-option">
                                <input type="radio" name="payment" value="CASH"> 
                                <span>💵 Наличными</span>
                            </label>
                        </div>
                    </div>

                    <div class="cart-total-row">
                        <span>Итого</span>
                        <span class="cart-sidebar-total">0 ₽</span>
                    </div>
                    <button class="checkout-btn">Оформить заказ</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // 1. Сначала находим основные контейнеры
        this.overlay = overlay;
        this.sidebar = overlay.querySelector('.cart-sidebar');

        // 2. ВАЖНО: Инициализируем переменные элементов СРАЗУ после создания HTML
        this.itemsContainer = this.sidebar.querySelector('.cart-items-list');
        this.totalElement = this.sidebar.querySelector('.cart-sidebar-total');
        this.checkoutBtn = this.sidebar.querySelector('.checkout-btn');
        this.addressInput = this.sidebar.querySelector('#cart-address');
        this.addressBlock = this.sidebar.querySelector('#address-block');
        this.deliveryMethod = 'COURIER';

        // 3. Теперь можно безопасно вешать обработчики событий
        
        // Логика переключения доставки
        const switches = this.sidebar.querySelectorAll('.del-switch');
        switches.forEach(btn => {
            btn.onclick = () => {
                switches.forEach(s => s.classList.remove('active'));
                btn.classList.add('active');
                this.deliveryMethod = btn.dataset.type;
                
                // Если самовывоз - скрываем адрес
                if (this.deliveryMethod === 'PICKUP') {
                    this.addressBlock.style.display = 'none';
                } else {
                    this.addressBlock.style.display = 'block';
                }
            };
        });

        // Смена оплаты
        const radios = this.sidebar.querySelectorAll('input[name="payment"]');
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.paymentStrategy = e.target.value === 'CARD' ? new CardPayment() : new CashPayment();
            });
        });

        // Закрытие
        const close = () => this.toggle(false);
        overlay.querySelector('.close-cart').addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        
        // Оформление заказа (Теперь this.checkoutBtn точно существует)
        this.checkoutBtn.addEventListener('click', () => this.handleCheckout());
    }

    async handleCheckout() {
        if (this.cartService.getTotalCount() === 0) {
            NotificationService.show('Корзина пуста!', 'info');
            return;
        }

        const user = this.authService.getUser();
        if (!user) {
            NotificationService.show('Нужно войти в аккаунт', 'error');
            const loginBtn = document.querySelector('.login-submit-btn');
            if (loginBtn) loginBtn.click();
            return;
        }

        // Проверка адреса
        let addressToSend = this.addressInput.value;
        if (this.deliveryMethod === 'COURIER') {
            if (!addressToSend || addressToSend.length < 5) {
                NotificationService.show('Укажите адрес доставки', 'error');
                this.addressInput.style.borderColor = 'red';
                return;
            }
        } else {
            addressToSend = "Самовывоз из ресторана"; 
        }

        const paymentMethod = this.sidebar.querySelector('input[name="payment"]:checked').value;

        // --- ЛОГИКА ОКНА ОПЛАТЫ ---
        if (paymentMethod === 'CARD') {
            // Эмуляция окна банка
            const confirmed = await this.showFakeBankModal(this.cartService.getTotalPrice());
            if (!confirmed) {
                NotificationService.show('Оплата отменена', 'info');
                return;
            }
        }

        // Если дошли сюда - значит оплатили или выбрали наличные
        this.checkoutBtn.disabled = true;
        this.checkoutBtn.textContent = "Оформляем...";

        try {
            const payload = {
                address: addressToSend,
                items: this.cartService.items.map(item => ({
                    dishId: item.dish.id,
                    quantity: item.count,
                    
                    // ДОБАВЛЯЕМ КОММЕНТАРИЙ В ЗАПРОС
                    comment: item.comment || '' 
                })),
                deliveryMethod: this.deliveryMethod,
                paymentMethod: paymentMethod
            };

            const response = await this.api.post('/orders', payload);
            
            // Если была карта, сразу ставим статус PAID через отдельный вызов (или бэкенд мог бы сам)
            // Но в твоем ТЗ "появляется окно подтверждения -> статус оплачен"
            if (paymentMethod === 'CARD') {
                await this.api.post(`/orders/${response.id}/pay`); 
                NotificationService.show('Оплата прошла успешно! Заказ отправлен на кухню.', 'success');
            } else {
                NotificationService.show('Заказ принят! Оплата при получении.', 'success');
            }

            this.cartService.clearCart();
            this.toggle(false);

        } catch (error) {
            NotificationService.show('Ошибка: ' + error.message, 'error');
        } finally {
            this.checkoutBtn.disabled = false;
            this.checkoutBtn.textContent = "Оформить заказ";
        }
    }

    // Вспомогательный метод для окна "Банка"
    showFakeBankModal(amount) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'auth-overlay visible';
            overlay.innerHTML = `
                <div class="auth-modal visible" style="text-align:center; max-width: 350px;">
                    <h3>🔐 Оплата картой</h3>
                    <p style="margin: 15px 0;">Сумма к списанию: <b>${amount} BYN</b></p>
                    <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <div style="font-family: monospace; font-size: 16px; margin-bottom: 5px;">**** **** **** 4242</div>
                        <div style="display:flex; justify-content:space-between; font-size: 12px;">
                            <span>DATE: 12/28</span>
                            <span>CVC: ***</span>
                        </div>
                    </div>
                    <button id="pay-confirm" class="login-submit-btn" style="background: #27ae60; color: white;">Оплатить</button>
                    <button id="pay-cancel" class="login-submit-btn" style="background: #eee; color: #333; margin-top: 10px;">Отмена</button>
                </div>
            `;
            document.body.appendChild(overlay);

            overlay.querySelector('#pay-confirm').onclick = () => {
                overlay.remove();
                resolve(true);
            };
            overlay.querySelector('#pay-cancel').onclick = () => {
                overlay.remove();
                resolve(false);
            };
        });
    }
    
    toggle(isOpen) {
        if (isOpen) {
            this.overlay.classList.remove('hidden');
            setTimeout(() => this.sidebar.classList.add('open'), 10);
            
            // Подгружаем адрес только если Курьер и поле пустое
            const user = this.authService.getUser();
            if (user && !this.addressInput.value && this.deliveryMethod === 'COURIER') {
                this.api.get('/users/me').then(u => { if (u.address) this.addressInput.value = u.address; });
            }
        } else {
            this.sidebar.classList.remove('open');
            setTimeout(() => this.overlay.classList.add('hidden'), 300);
        }
    }
    
    update(cartState) {
        this.itemsContainer.innerHTML = '';
        if (cartState.items.length === 0) {
            this.itemsContainer.innerHTML = '<div class="empty-msg">Корзина пуста 😔</div>';
        } else {
            cartState.items.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                // Делаем flex-column, чтобы комментарий был снизу
                itemEl.style.flexDirection = 'column'; 
                itemEl.style.alignItems = 'stretch';

                // Генерируем HTML
                itemEl.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.dish.name}</div>
                            <div class="cart-item-price">${(item.dish.price * item.count).toFixed(2)} BYN</div> 
                        </div>
                        <div class="cart-item-controls">
                            <button class="qty-btn minus" data-id="${item.dish.id}">-</button>
                            <span class="count">${item.count}</span>
                            <button class="qty-btn plus" data-id="${item.dish.id}">+</button>
                        </div>
                    </div>
                    <!-- ПОЛЕ КОММЕНТАРИЯ -->
                    <input type="text" class="item-comment" data-id="${item.dish.id}" 
                           placeholder="Пожелания (без лука, острый...)" 
                           value="${item.comment || ''}" 
                           style="width:100%; font-size:12px; padding:6px; border:1px solid #eee; border-radius:6px;">
                `;
                this.itemsContainer.appendChild(itemEl);
            });

            // Навешиваем события кнопок +/-
            this.itemsContainer.querySelectorAll('.minus').forEach(btn => {
                btn.onclick = () => this.cartService.decreaseItem(parseInt(btn.dataset.id));
            });
            this.itemsContainer.querySelectorAll('.plus').forEach(btn => {
                btn.onclick = () => this.cartService.increaseItem(parseInt(btn.dataset.id));
            });

            // НАВЕШИВАЕМ СОБЫТИЕ НА ИНПУТ КОММЕНТАРИЯ
            this.itemsContainer.querySelectorAll('.item-comment').forEach(input => {
                input.addEventListener('input', (e) => {
                    this.cartService.updateItemComment(parseInt(e.target.dataset.id), e.target.value);
                });
            });
        }
        this.totalElement.textContent = `${cartState.totalPrice} BYN`;
    }
}