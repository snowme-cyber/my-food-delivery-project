import ApiClient from './core/ApiClient.js';
import AuthService from './services/AuthService.js';
import NotificationService from './services/NotificationService.js';
import ConfirmationModal from './components/ConfirmationModal.js';

class AdminApp {
    constructor() {
        this.api = new ApiClient();
        this.authService = new AuthService();
        this.dishesCache = []; 
        
        this.checkAccess();
        
        this.contentArea = document.getElementById('content-area');
        this.pageTitle = document.getElementById('page-title');
        
        this.initTabs();
        this.loadOrders(); 
    }

    checkAccess() {
        const user = this.authService.getUser();
        if (!user || user.role !== 'ROLE_ADMIN') {
            NotificationService.show('Требуются права администратора!', 'error');
            setTimeout(() => window.location.href = '/', 1000);
        }
    }

    initTabs() {
        const tabs = document.querySelectorAll('.admin-menu-item[data-tab]');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const tabName = tab.dataset.tab;
                if (tabName === 'orders') this.loadOrders();
                if (tabName === 'menu') this.loadMenu();
                if (tabName === 'employees') this.loadEmployees();
            });
        });
    }

    // --- ЗАКАЗЫ ---
    async loadOrders() {
        this.pageTitle.innerText = '📦 Заказы';
        this.contentArea.innerHTML = '<div class="admin-card">Загрузка...</div>';
        try {
            const orders = await this.api.get('/admin/orders');
            this.renderOrdersTable(orders, this.contentArea);
        } catch (e) {
            this.contentArea.innerHTML = `<div class="admin-card error">Ошибка: ${e.message}</div>`;
        }
    }

    renderOrdersTable(orders, container) {
        let html = `
            <div class="admin-card" style="overflow-x: auto;">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Инфо</th>
                        <th>Состав</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        const statusMap = {
            'CREATED': 'Создан', 'PAID': 'Оплачен', 'COOKING': 'Готовится',
            'DELIVERING': 'В пути', 'COMPLETED': 'Выполнен', 'CANCELLED': 'Отменен'
        };

        orders.forEach(order => {
            const rusStatus = statusMap[order.status] || order.status;
            let statusBadge = `<span class="status-badge status-${order.status.toLowerCase()}">${rusStatus}</span>`;
            
            if (order.status === 'CREATED' && order.paymentMethod !== 'CASH') {
                 statusBadge += '<div style="color:red; font-size:10px; margin-top:4px; font-weight:600;">Не оплачен</div>';
            }

            // 1. ЛОГИКА ЗЕЛЕНОЙ КНОПКИ (СЛЕДУЮЩИЙ ШАГ)
            let actionBtn = '';
            if (['CREATED', 'PAID'].includes(order.status)) {
                actionBtn = `<button class="action-btn btn-green btn-status" data-id="${order.id}" data-status="COOKING">👨‍🍳 Готовить</button>`;
            }
            else if (order.status === 'COOKING') {
                const txt = order.deliveryMethod === 'PICKUP' ? '📦 Готов к выдаче' : '🚗 Отдать курьеру';
                actionBtn = `<button class="action-btn btn-green btn-status" data-id="${order.id}" data-status="DELIVERING">${txt}</button>`;
            }
            else if (order.status === 'DELIVERING') {
                actionBtn = `<button class="action-btn btn-green btn-status" data-id="${order.id}" data-status="COMPLETED">✅ Завершить</button>`;
            }

            // 2. ЛОГИКА КРАСНОЙ КНОПКИ (ОТМЕНА)
            // Показываем кнопку отмены, только если заказ еще не завершен и не отменен
            let cancelBtn = '';
            if (order.status !== 'COMPLETED' && order.status !== 'CANCELLED') {
                // style="margin-left: 5px" - чтобы кнопки не слипались
                cancelBtn = `<button class="action-btn btn-delete btn-cancel" data-id="${order.id}" style="margin-left: 8px;">❌ Отмена</button>`;
            }

            html += `
                <tr>
                    <td><b>#${order.id}</b></td>
                    <td>
                        <div style="font-weight:bold;">${order.deliveryMethod === 'PICKUP' ? 'Самовывоз' : 'Курьер'}</div>
                        <div style="font-size:12px; margin-top:4px;">${order.paymentMethod === 'CASH' ? 'Наличные' : 'Карта'}</div>
                        <div style="font-size:12px; color:#666; margin-top:4px;">${order.address}</div>
                    </td>
                    <td>${order.items.map(i => `<div>• ${i.dishName} x${i.quantity}</div>`).join('')} <div style="margin-top:5px; font-weight:bold;">${order.totalPrice} BYN</div></td>
                    <td>${statusBadge}</td>
                    <td style="white-space: nowrap;">
                        ${actionBtn}
                        ${cancelBtn}
                    </td>
                </tr>
            `;
        });
        html += '</tbody></table></div>';
        container.innerHTML = html;

        // Обработчик ЗЕЛЕНОЙ кнопки (Статус вперед)
        container.querySelectorAll('.btn-status').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeStatus(e.target.dataset.id, e.target.dataset.status));
        });

        // Обработчик КРАСНОЙ кнопки (Отмена)
        container.querySelectorAll('.btn-cancel').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                // Защита от случайного нажатия
                const confirmed = await ConfirmationModal.ask(`Вы действительно хотите отменить заказ #${id}?`);
                
                if (confirmed) {
                    this.changeStatus(id, 'CANCELLED');
                }
            });
        });
    }

    async changeStatus(id, st) {
        try {
            await this.api.put(`/admin/orders/${id}/status?status=${st}`);
            this.loadOrders();
        } catch(e) { NotificationService.show(e.message, 'error'); }
    }

    // --- СОТРУДНИКИ ---
    async loadEmployees() {
        this.pageTitle.innerText = '👥 Сотрудники';
        this.contentArea.innerHTML = '<div class="admin-card">Загрузка...</div>';
        try {
            const users = await this.api.get('/admin/users');
            this.contentArea.innerHTML = '';
            
            const addBtn = document.createElement('button');
            addBtn.className = 'admin-add-btn';
            addBtn.innerHTML = '<span>+</span> Новый Админ';
            addBtn.onclick = () => this.openEmployeeModal();
            this.contentArea.appendChild(addBtn);

            let html = '<div class="admin-card"><table class="admin-table"><thead><tr><th>ID</th><th>Имя</th><th>Email</th><th>Действия</th></tr></thead><tbody>';
            users.forEach(u => {
                const btn = u.isBlocked ? `<button class="action-btn btn-green btn-block" data-id="${u.id}">Разблок</button>` : `<button class="action-btn btn-delete btn-block" data-id="${u.id}">Блок</button>`;
                html += `<tr style="${u.isBlocked ? 'opacity:0.5' : ''}"><td>${u.id}</td><td>${u.username}</td><td>${u.email}</td><td>${btn}</td></tr>`;
            });
            html += '</tbody></table></div>';
            
            const div = document.createElement('div');
            div.innerHTML = html;
            this.contentArea.appendChild(div);

            div.querySelectorAll('.btn-block').forEach(b => b.onclick = async (e) => {
                if(await ConfirmationModal.ask('Изменить статус?')) {
                    try {
                        await this.api.put(`/admin/users/${e.target.dataset.id}/block`, {});
                        this.loadEmployees();
                    } catch(err) { NotificationService.show(err.message, 'error'); }
                }
            });
        } catch(e) { this.contentArea.innerHTML = `<div class="error">${e.message}</div>`; }
    }

    // --- МЕНЮ (ИСПРАВЛЕННОЕ) ---
    async loadMenu() {
        this.pageTitle.innerText = '🍽️ Меню ресторана';
        this.contentArea.innerHTML = '<div class="admin-card">Загрузка...</div>';
        
        try {
            // Добавляем timestamp чтобы сбросить кэш
            const dishes = await this.api.get(`/admin/menu?t=${new Date().getTime()}`);
            this.dishesCache = dishes;
            this.contentArea.innerHTML = '';

            const addBtn = document.createElement('button');
            addBtn.className = 'admin-add-btn';
            addBtn.innerHTML = '<span>+</span> Добавить блюдо';
            addBtn.onclick = () => this.openDishModal(null);
            this.contentArea.appendChild(addBtn);

            this.renderMenuTable(dishes);
        } catch (e) {
            this.contentArea.innerHTML = `<div class="admin-card error">Ошибка: ${e.message}</div>`;
        }
    }

    renderMenuTable(dishes) {
        const card = document.createElement('div');
        card.className = 'admin-card';
        
        let html = `
        <div style="overflow-x: auto;">
            <table class="admin-table">
                <thead><tr><th>Фото</th><th>Название</th><th>Цена</th><th>Статус</th><th>Действия</th></tr></thead>
                <tbody>
        `;

        dishes.forEach(dish => {
            const isAvail = (dish.isAvailable === true || dish.isAvailable === 'true');
            const badge = isAvail 
                ? '<span class="status-badge" style="background:#e8f5e9; color:#2e7d32;">В наличии</span>' 
                : '<span class="status-badge" style="background:#ffebee; color:#c62828;">СТОП-ЛИСТ</span>';

            html += `
                <tr style="${isAvail ? '' : 'opacity:0.6'}">
                    <td><img src="${dish.imageUrl}" style="width:40px; height:40px; border-radius:4px; object-fit:cover;"></td>
                    <td>${dish.name}</td>
                    <td><b>${dish.price}</b></td>
                    <td>${badge}</td>
                    <td>
                        <button class="action-btn btn-edit" data-id="${dish.id}">✏️</button>
                        <button class="action-btn btn-delete" data-id="${dish.id}">🗑️</button>
                    </td>
                </tr>
            `;
        });
        html += '</tbody></table></div>';
        card.innerHTML = html;
        this.contentArea.appendChild(card);

        card.querySelectorAll('.btn-delete').forEach(b => b.onclick = (e) => this.deleteDish(e.target.dataset.id));
        card.querySelectorAll('.btn-edit').forEach(b => {
            b.onclick = (e) => {
                const dish = this.dishesCache.find(d => d.id == e.target.dataset.id);
                this.openDishModal(dish);
            };
        });
    }

    // МОДАЛКА БЛЮДА (ИСПРАВЛЕН ЧЕКБОКС)
    openDishModal(dishToEdit = null) {
        const isEdit = !!dishToEdit;
        const title = isEdit ? 'Редактировать' : 'Новое блюдо';
        
        // Данные
        const nameVal = isEdit ? dishToEdit.name : '';
        const descVal = isEdit ? dishToEdit.description : '';
        const priceVal = isEdit ? dishToEdit.price : '';
        const imgVal = isEdit ? dishToEdit.imageUrl : '';
        // Важно: если isAvailable null, считаем true
        let isAvail = isEdit ? (dishToEdit.isAvailable !== false) : true;

        const overlay = document.createElement('div');
        overlay.className = 'auth-overlay visible';
        
        overlay.innerHTML = `
            <div class="auth-modal visible" onclick="event.stopPropagation()" style="max-width:500px;">
                <div class="auth-header"><h3>${title}</h3><button class="auth-close">×</button></div>
                
                <div class="input-group"><label>Название</label><input id="d-name" class="modal-input" value="${nameVal}"></div>
                <div class="input-group"><label>Описание</label><textarea id="d-desc" class="modal-input">${descVal}</textarea></div>
                <div class="input-group"><label>Цена</label><input id="d-price" class="modal-input" type="number" value="${priceVal}"></div>
                <div class="input-group"><label>Фото URL</label><input id="d-img" class="modal-input" value="${imgVal}"></div>
                
                <div class="input-group"><label>Категория</label>
                    <select id="d-cat" class="modal-input" style="background:white">
                        <option value="1">Пицца</option><option value="2">Бургеры</option><option value="3">Закуски</option>
                        <option value="4">Суши</option><option value="5">Салаты</option><option value="6">Супы</option>
                        <option value="7">Паста</option><option value="8">Горячее</option><option value="9">Десерты</option>
                        <option value="10">Напитки</option>
                    </select>
                </div>

                <!-- ЧЕКБОКС -->
                <div id="avail-wrapper" style="background:#f5f5f5; padding:15px; border-radius:8px; cursor:pointer; display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" id="d-avail" ${isAvail ? 'checked' : ''} style="pointer-events:none;">
                    <span id="d-avail-text" style="font-weight:bold;"></span>
                </div>

                <button id="d-save" class="login-submit-btn" style="margin-top:20px;">Сохранить</button>
            </div>
        `;
        document.body.appendChild(overlay);

        // Устанавливаем категорию
        const catSelect = overlay.querySelector('#d-cat');
        // Простой маппинг по имени, если нет ID
        const catMap = {'Пицца':1, 'Бургеры':2, 'Закуски':3, 'Суши':4, 'Салаты':5, 'Супы':6, 'Паста':7, 'Горячее':8, 'Десерты':9, 'Напитки':10};
        if(isEdit && dishToEdit.categoryName) catSelect.value = catMap[dishToEdit.categoryName] || 1;

        // Логика чекбокса
        const cb = overlay.querySelector('#d-avail');
        const txt = overlay.querySelector('#d-avail-text');
        const wrap = overlay.querySelector('#avail-wrapper');

        const updateUI = () => {
            if(cb.checked) {
                txt.innerText = '✅ В наличии'; txt.style.color='green'; wrap.style.border='2px solid green';
            } else {
                txt.innerText = '⛔ Стоп-лист'; txt.style.color='red'; wrap.style.border='2px solid red';
            }
        };
        updateUI();
        wrap.onclick = () => { cb.checked = !cb.checked; updateUI(); };

        // Сохранение
        overlay.querySelector('#d-save').onclick = async () => {
            const data = {
                name: document.getElementById('d-name').value,
                description: document.getElementById('d-desc').value,
                price: parseFloat(document.getElementById('d-price').value),
                imageUrl: document.getElementById('d-img').value,
                categoryId: parseInt(catSelect.value),
                isAvailable: cb.checked
            };

            try {
                if(isEdit) await this.api.put(`/admin/menu/${dishToEdit.id}`, data);
                else await this.api.post('/admin/menu', data);
                
                NotificationService.show('Готово', 'success');
                document.body.removeChild(overlay);
                this.loadMenu();
            } catch(e) { NotificationService.show(e.message, 'error'); }
        };

        const close = () => document.body.removeChild(overlay);
        overlay.querySelector('.auth-close').onclick = close;
    }

    async deleteDish(id) {
        if(await ConfirmationModal.ask('Удалить блюдо?')) {
            try {
                await this.api.delete(`/admin/menu/${id}`);
                this.loadMenu();
            } catch(e) { NotificationService.show(e.message, 'error'); }
        }
    }

    openEmployeeModal() {
        const name = prompt("Имя админа:");
        // Упрощено для краткости, можно вернуть полную форму если нужно
        if(name) alert("Функция в разработке"); 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdminApp();
});