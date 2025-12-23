import VisualComponent from '../patterns/structural/decorator/Component.js';
import AuthService from '../services/AuthService.js';
import ApiClient from '../core/ApiClient.js';
import NotificationService from '../services/NotificationService.js';
import ConfirmationModal from './ConfirmationModal.js';


export default class UserProfileModal extends VisualComponent {
    constructor() {
        super();
        this.authService = new AuthService();
        this.api = new ApiClient();
        this.overlay = null;
        this.activeTab = 'profile'; // 'profile' | 'history'
    }

    open() {
        this.render();
        // БЛОКИРУЕМ ПРОКРУТКУ ФОНА
        document.body.style.overflow = 'hidden'; 
        
        // Загружаем данные (по дефолту профиль)
        this.loadProfileData(); 
    }

render() {
        if (document.querySelector('.profile-modal-overlay')) return;

        this.overlay = document.createElement('div');
        this.overlay.className = 'auth-overlay visible profile-modal-overlay';
        
        this.overlay.innerHTML = `
            <div class="auth-modal visible profile-modal" onclick="event.stopPropagation()">
                <!-- ШАПКА -->
                <div class="auth-header" style="padding: 20px 30px;">
                    <h3 style="margin:0;">Личный кабинет</h3>
                    <button class="auth-close">&times;</button>
                </div>
                
                <div class="profile-tabs">
                    <div class="profile-tab active" data-tab="profile">Данные</div>
                    <div class="profile-tab" data-tab="history">История заказов</div>
                </div>

                <!-- КОНТЕНТ (Сюда грузятся данные) -->
                <div id="profile-content-area" class="profile-content">
                    <div style="display:flex; justify-content:center; align-items:center; height:100%; color:#999;">
                        Загрузка...
                    </div>
                </div>
                
                <!-- ПОДВАЛ С КНОПКОЙ -->
                <div class="profile-footer-area">
                    <button id="logout-btn" class="logout-btn-styled">
                        <span>🚪</span> Выйти из аккаунта
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);

        // ОБНОВЛЕННАЯ ФУНКЦИЯ ЗАКРЫТИЯ
        const close = () => { 
            if(this.overlay) this.overlay.remove();
            // РАЗБЛОКИРУЕМ ПРОКРУТКУ ФОНА
            document.body.style.overflow = ''; 
        };

        this.overlay.querySelector('.auth-close').onclick = close;
        
        // Закрытие по клику на затемненный фон
        this.overlay.onclick = (e) => {
            if (e.target === this.overlay) close();
        };

        this.overlay.querySelector('#logout-btn').onclick = async () => {
        const confirmed = await ConfirmationModal.ask('Вы действительно хотите выйти из аккаунта?');
        if (confirmed) {
            this.authService.logout();
            close();
        }
};

        // Переключение табов
        const tabs = this.overlay.querySelectorAll('.profile-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.activeTab = tab.dataset.tab;
                
                if (this.activeTab === 'profile') this.loadProfileData();
                else this.loadHistoryData();
            });
        });
    }

    // --- Вкладка 1: Профиль ---
    async loadProfileData() {
        const container = this.overlay.querySelector('#profile-content-area');
        container.innerHTML = 'Загрузка...';

        try {
            // GET запрос на бэкенд
            const user = await this.api.get('/users/me');
            
            container.innerHTML = `
                <div class="input-group">
                    <label>Имя</label>
                    <input type="text" id="prof-name" value="${user.username || ''}">
                </div>
                <div class="input-group">
                    <label>Email</label>
                    <input type="email" id="prof-email" value="${user.email || ''}">
                </div>
<div class="input-group">
    <label>Телефон</label>
    <input type="tel" id="prof-phone" value="${user.phone || '+375'}" placeholder="+375 (XX) XXX-XX-XX">
</div>
                <div class="input-group">
                    <label>Адрес доставки (по умолчанию)</label>
                    <input type="text" id="prof-address" value="${user.address || ''}" placeholder="Город, улица, дом...">
                </div>
                <button id="prof-save" class="login-submit-btn" style="margin-top: 10px;">Сохранить изменения</button>
            `;

            container.querySelector('#prof-save').onclick = () => this.saveProfile();

        } catch (e) {
            container.innerHTML = `<div style="color:red">Ошибка загрузки профиля: ${e.message}</div>`;
        }
    }

    async saveProfile() {
        const data = {
            username: document.getElementById('prof-name').value,
            email: document.getElementById('prof-email').value,
            phone: document.getElementById('prof-phone').value,
            address: document.getElementById('prof-address').value
        };

         // --- ДОБАВЛЯЕМ ВАЛИДАЦИЮ ---
        const emailRegex = /^[a-zA-Z0-9._-]+@(gmail\.com|mail\.ru|yandex\\.ru|yandex\.by|bk\\.ru|inbox\\.ru|list\\.ru|icloud\\.com|yahoo\\.com|outlook\\.com)$/;
        
        if (!emailRegex.test(data.email.toLowerCase())) {
            NotificationService.show('Недопустимый домен почты (используйте gmail, yandex, mail.ru и т.д.)', 'error');
            const emailInput = document.getElementById('prof-email');
            emailInput.style.borderColor = 'red';
            setTimeout(() => emailInput.style.borderColor = '#ccc', 2000);
            return; // Прерываем сохранение
        }

        // Запоминаем текущий email до отправки
        const currentUser = this.authService.getUser();
        const oldEmail = currentUser ? currentUser.email : null; // Или username, если там хранится email

       try {
            await this.api.put('/users/me', data);
            
            // --- ЛОГИКА СМЕНЫ EMAIL ---
            if (oldEmail && data.email !== oldEmail) {
                // 1. Не закрываем окно, а меняем заголовок и контент
                const header = this.overlay.querySelector('.auth-header h3');
                if(header) header.innerText = 'Требуется авторизация';
                
                // Скрываем табы
                const tabs = this.overlay.querySelector('.profile-tabs');
                if(tabs) tabs.style.display = 'none';

                // 2. Показываем красивое сообщение внутри
                const container = this.overlay.querySelector('#profile-content-area');
                container.innerHTML = `
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; padding:20px;">
                        <div style="font-size: 50px; margin-bottom: 20px;">🔒</div>
                        <h3 style="margin-bottom: 10px;">Вы изменили Email</h3>
                        <p style="color:#666; font-size:14px; line-height:1.5;">
                            В целях безопасности текущая сессия завершена.<br>
                            Пожалуйста, войдите в аккаунт с новыми данными.
                        </p>
                        <div style="margin-top: 20px; width:100%;">
                            <button id="re-login-btn" class="login-submit-btn">Войти заново</button>
                        </div>
                    </div>
                `;
                
                // Скрываем нижнюю кнопку выхода (она там не нужна)
                const footer = this.overlay.querySelector('.profile-footer-area');
                if(footer) footer.style.display = 'none';

                // 3. Выполняем "мягкий" выход (без перезагрузки страницы)
                this.authService.logout(false);

                // 4. Вешаем событие на кнопку "Войти заново"
                container.querySelector('#re-login-btn').onclick = () => {
                    // Закрываем профиль
                    this.overlay.remove();
                    
                    // Находим виджет в хедере (который уже обновился и показывает кнопку "Войти")
                    // Имитируем клик по кнопке входа
                    setTimeout(() => {
                        const headerLoginBtn = document.querySelector('.header-right-section .login-submit-btn');
                        if (headerLoginBtn) {
                            headerLoginBtn.click();
                            
                            // (Опционально) Можно попытаться предзаполнить email в открывшемся окне
                            setTimeout(() => {
                                const emailInput = document.getElementById('modal-email');
                                if(emailInput) emailInput.value = data.email;
                            }, 300);
                        } else {
                            // Если вдруг кнопки нет - перезагружаем
                            window.location.reload();
                        }
                    }, 200);
                };
                
                return; // Прерываем выполнение, чтобы не сработал код ниже
            }
            // ---------------------------

            NotificationService.show('Профиль обновлен!', 'success');
            
            // Обновляем локальные данные (если email не менялся)
            currentUser.name = data.username;
            currentUser.phone = data.phone;
            currentUser.address = data.address;
            
            localStorage.setItem('user_data', JSON.stringify(currentUser));
            this.authService.notify(currentUser);
            
        } catch (e) {
            NotificationService.show('Ошибка сохранения: ' + e.message, 'error');
        }
    }

    async loadHistoryData() {
        const container = this.overlay.querySelector('#profile-content-area');
        container.innerHTML = '<div style="padding:40px; text-align:center;">⏳ Загрузка истории...</div>';

        try {
            const orders = await this.api.get('/orders');
            container.innerHTML = ''; 

            if (!orders || orders.length === 0) {
                container.innerHTML = '<div style="text-align:center; padding: 40px; color: #999;">У вас пока нет заказов 😔</div>';
                return;
            }

            const statusMap = {
                'CREATED': 'Создан', 'PAID': 'Оплачен', 'COOKING': 'Готовится',
                'DELIVERING': 'В пути', 'COMPLETED': 'Выполнен', 'CANCELLED': 'Отменен'
            };

            orders.forEach(order => {
                const date = new Date(order.createdAt).toLocaleString('ru-RU');
                const rusStatus = statusMap[order.status] || order.status;
                
                // ТОВАРЫ
                const itemsStr = order.items.map(i => {
                    const note = i.comment ? ` <span style="color:#e67e22">(${i.comment})</span>` : '';
                    return `${i.dishName} x${i.quantity}${note}`;
                }).join('<br>');

                // --- КНОПКИ (ВАШ СТИЛЬ) ---
                let buttonsHtml = '';

                // ОПЛАТИТЬ / ОТМЕНИТЬ
                if (order.status === 'CREATED') {
                    buttonsHtml += `<button class="action-btn pay-btn" style="background:#27ae60; color:white; border:none; margin-right:5px; padding:6px 12px; border-radius:8px; cursor:pointer;">Оплатить</button>`;
                    buttonsHtml += `<button class="action-btn cancel-btn" style="border:1px solid #e74c3c; color:#e74c3c; background:white; padding:6px 12px; border-radius:8px; cursor:pointer;">Отменить</button>`;
                } 
                // ВОССТАНОВИТЬ / УДАЛИТЬ
                else if (order.status === 'CANCELLED') {
                    buttonsHtml += `<button class="action-btn restore-btn" style="border:1px solid #27ae60; color:#27ae60; background:white; margin-right:5px; padding:6px 12px; border-radius:8px; cursor:pointer;">Восстановить</button>`;
                    buttonsHtml += `<button class="action-btn delete-btn" style="border:1px solid #999; color:#999; background:white; padding:6px 12px; border-radius:8px; cursor:pointer;">Удалить</button>`;
                }

                const card = document.createElement('div');
                card.className = 'order-card';
                card.innerHTML = `
                    <div class="order-header">
                        <div>
                            <div class="order-id">Заказ #${order.id}</div>
                            <div class="order-date">${date}</div>
                        </div>
                        <div class="status-badge status-${order.status.toLowerCase()}">${rusStatus}</div>
                    </div>
                    <div class="order-items-text">${itemsStr}</div>
                    <div class="order-footer">
                        <div class="order-total" style="font-weight: bold;">${order.totalPrice} BYN</div>
                        <div style="margin-top: 10px; display:flex; flex-wrap:wrap; gap:8px;">
                            ${buttonsHtml}
                            <button class="action-btn repeat-btn" style="background:#FCE000; color:#21201F; border:none; padding:6px 12px; border-radius:8px; cursor:pointer;">🔄 Повторить</button>
                        </div>
                    </div>
                `;

                // --- НАВЕШИВАЕМ СОБЫТИЯ (ИСПОЛЬЗУЕМ ConfirmationModal) ---
                
                // 1. ОТМЕНА
                const cancelBtn = card.querySelector('.cancel-btn');
                if (cancelBtn) {
                    cancelBtn.onclick = async () => {
                        const confirmed = await ConfirmationModal.ask('Вы точно хотите отменить заказ?');
                        if (confirmed) {
                            try {
                                await this.api.post(`/orders/${order.id}/cancel`);
                                NotificationService.show('Заказ отменен', 'info');
                                this.loadHistoryData();
                            } catch(e) { NotificationService.show(e.message, 'error'); }
                        }
                    };
                }

                // 2. ВОССТАНОВЛЕНИЕ
                const restoreBtn = card.querySelector('.restore-btn');
                if (restoreBtn) {
                    restoreBtn.onclick = async () => {
                        const confirmed = await ConfirmationModal.ask('Восстановить этот заказ?');
                        if (confirmed) {
                            try {
                                await this.api.post(`/orders/${order.id}/restore`);
                                NotificationService.show('Заказ восстановлен!', 'success');
                                this.loadHistoryData();
                            } catch(e) { NotificationService.show(e.message, 'error'); }
                        }
                    };
                }

                // 3. УДАЛЕНИЕ
                const deleteBtn = card.querySelector('.delete-btn');
                if (deleteBtn) {
                    deleteBtn.onclick = async () => {
                        const confirmed = await ConfirmationModal.ask('Удалить запись из истории?');
                        if (confirmed) {
                            try {
                                await this.api.delete(`/orders/${order.id}`);
                                this.loadHistoryData();
                            } catch(e) { NotificationService.show(e.message, 'error'); }
                        }
                    };
                }

                // 4. ОПЛАТА
                const payBtn = card.querySelector('.pay-btn');
                if (payBtn) {
                    payBtn.onclick = async () => {
                        try {
                            await this.api.post(`/orders/${order.id}/pay`);
                            NotificationService.show('Оплачено!', 'success');
                            this.loadHistoryData();
                        } catch(e) { NotificationService.show(e.message, 'error'); }
                    };
                }

                // 5. ПОВТОР (ВАША ЛОГИКА)
                card.querySelector('.repeat-btn').onclick = () => {
                    import('../services/CartService.js').then(module => {
                        const cartService = module.default.instance;
                        cartService.addItemsFromHistory(order.items);
                        NotificationService.show('Товары добавлены в корзину!', 'success');
                        
                        if(this.overlay) this.overlay.remove();
                        document.dispatchEvent(new CustomEvent('toggle-cart-sidebar'));
                    });
                };

                container.appendChild(card);
            });

        } catch (e) {
            container.innerHTML = `<div style="color:red; padding:20px;">Ошибка: ${e.message}</div>`;
        }
    }

    // Хелпер для модального окна подтверждения (вместо confirm)
    async handleActionWithConfirm(text, actionFn) {
        const confirmed = await ConfirmationModal.ask(text);
        if (confirmed) {
            actionFn();
        }
    }

    async payOrder(id, amount) {
        // Используем фейковое окно банка из CartSidebar (можно вынести в отдельный класс, но продублируем для скорости)
        const confirmed = await this.showFakeBankModal(amount);
        if (confirmed) {
            try {
                await this.api.post(`/orders/${id}/pay`);
                NotificationService.show('Заказ оплачен!', 'success');
                this.loadHistoryData();
            } catch(e) { NotificationService.show(e.message, 'error'); }
        }
    }

    // Копия метода банка (лучше вынести в utils, но вставим сюда)
    showFakeBankModal(amount) {
        return new Promise((resolve) => {
            const div = document.createElement('div');
            div.className = 'auth-overlay visible';
            div.innerHTML = `
                <div class="auth-modal visible" style="text-align:center; max-width:350px;">
                    <h3>💳 Оплата</h3>
                    <p>Сумма: <b>${amount} BYN</b></p>
                    <button id="p-yes" class="login-submit-btn" style="background:#27ae60; color:white;">Оплатить</button>
                    <button id="p-no" class="login-submit-btn" style="background:#eee; color:#333; margin-top:10px;">Отмена</button>
                </div>`;
            document.body.appendChild(div);
            div.querySelector('#p-yes').onclick = () => { div.remove(); resolve(true); };
            div.querySelector('#p-no').onclick = () => { div.remove(); resolve(false); };
        });
    }

    // НОВЫЕ МЕТОДЫ ДЕЙСТВИЙ

    async restoreOrder(id) {
        if(!confirm('Восстановить этот заказ?')) return;
        try {
            await this.api.post(`/orders/${id}/restore`, {});
            NotificationService.show('Заказ восстановлен!', 'success');
            this.loadHistoryData();
        } catch(e) { NotificationService.show(e.message, 'error'); }
    }

    async deleteOrder(id) {
        if(!confirm('Удалить заказ из истории навсегда?')) return;
        try {
            await this.api.delete(`/orders/${id}`);
            NotificationService.show('Заказ удален', 'info');
            this.loadHistoryData();
        } catch(e) { NotificationService.show(e.message, 'error'); }
    }

    // Логика "Изменить / Расширить":
    // Мы добавляем товары из этого заказа в корзину и перекидываем в меню
    async editOrder(order) {
        // Здесь нам нужно найти объекты Dish. Но у нас в истории только названия.
        // Это сложность. НО! У нас в истории обычно есть dishId (если backend его отдает).
        // Проверь OrderResponse.java. Если там нет dishId в OrderItemResponse, добавь его.
        
        // Допустим, мы просто перекинем пользователя в меню с сообщением
        NotificationService.show('Добавьте новые блюда и оформите заказ заново', 'info');
        if(this.overlay) this.overlay.remove();
        window.location.href = '/'; 
        
        // В идеале: нужно в OrderResponse отдавать ID блюд, тогда можно сделать:
        // CartService.instance.addToCart(dishId...)
    }

    async cancelOrder(id) {
        const confirmed = await ConfirmationModal.ask('Вы уверены, что хотите отменить этот заказ?');
        if (!confirmed) return;
    
        try {
            await this.api.post(`/orders/${id}/cancel`, {});
            NotificationService.show('Заказ отменен', 'info');
            this.loadHistoryData();
        } catch (e) {
            NotificationService.show('Ошибка отмены: ' + e.message, 'error');
        }
    }

    translateStatus(status) {
        const map = {
            'CREATED': 'Создан',
            'PAID': 'Оплачен',
            'COOKING': 'Готовится',
            'DELIVERING': 'В пути / Готов',
            'COMPLETED': 'Выполнен',
            'CANCELLED': 'Отменен'
        };
        return map[status] || status;
    }
}