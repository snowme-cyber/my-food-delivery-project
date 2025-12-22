import Subject from '../patterns/behavioral/observer/Subject.js';

export default class CartService extends Subject {
    constructor() {
        super();
        if (CartService.instance) {
            return CartService.instance;
        }
        CartService.instance = this;
        
        const saved = localStorage.getItem('cart_items');
        this.items = saved ? JSON.parse(saved) : []; 
        
        // --- ИСПРАВЛЕНИЕ: Сразу считаем сумму при запуске ---
        // Но уведомлять пока некому (подписчиков еще нет), 
        // поэтому просто убедимся, что данные валидны.
    }
    getCurrentState() {
        return {
            items: this.items,
            totalPrice: this.getTotalPrice().toFixed(2),
            totalCount: this.getTotalCount()
        };
    }

    addToCart(dish) {
        // Защита от дублей и неправильных данных
        if (!dish || !dish.price || dish.price < 0) return;

        const existingItem = this.items.find(item => item.dish.id === dish.id);
        if (existingItem) {
            existingItem.count++; // Обычное увеличение
        } else {
            this.items.push({ dish: dish, count: 1, comment: '' });
        }
        this._notifyCartChanged();
    }

    // --- НОВЫЕ МЕТОДЫ ---
    increaseItem(dishId) {
        const item = this.items.find(i => i.dish.id === dishId);
        if (item) {
            item.count++;
            this._notifyCartChanged();
        }
    }

    decreaseItem(dishId) {
        const itemIndex = this.items.findIndex(i => i.dish.id === dishId);
        if (itemIndex !== -1) {
            const item = this.items[itemIndex];
            item.count--;
            if (item.count <= 0) {
                this.items.splice(itemIndex, 1); // Удаляем, если 0
            }
            
            this._notifyCartChanged();
        }
    }

    clearCart() {
        this.items = [];
        this._notifyCartChanged();
    }
    // ---------------------

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.dish.price * item.count), 0);
    }

    getTotalCount() {
        return this.items.reduce((total, item) => total + item.count, 0);
    }

    _notifyCartChanged() {
        // Сохраняем в localStorage при каждом изменении
        localStorage.setItem('cart_items', JSON.stringify(this.items));

        const state = {
            items: this.items,
            totalPrice: this.getTotalPrice().toFixed(2), // Округляем до копеек
            totalCount: this.getTotalCount()
        };
        this.notify(state);
    }

    // Загрузить товары в корзину (например, из истории)
    setItems(newItems) {
        // Преобразуем формат истории (dishName, quantity) в формат корзины (Dish object, count)
        // ПРОБЛЕМА: В истории у нас нет объекта Dish (цены, картинки, ID).
        // РЕШЕНИЕ: Нам нужно, чтобы Backend отдавал ID блюда в истории.
        // Если ID блюда нет, мы не сможем добавить его в корзину корректно.
        
        // Предположим, что мы добавили dishId в API. Если нет, этот функционал будет ограничен.
        // Пока реализуем простую очистку, так как без ID блюд восстановить корзину сложно.
        
        this.items = newItems;
        this._notifyCartChanged();
    }
    
    // ВАЖНО: Для полноценного редактирования нужно изменить OrderResponse.java на бэкенде, 
    // чтобы он возвращал полный объект Dish или хотя бы ID, цену и картинку в списке items.
     addItemsFromHistory(historyItems) {
        historyItems.forEach(hItem => {
            // Создаем "фейковый" объект блюда, так как у нас есть ID и цена
            // Этого достаточно для корзины
            const dish = {
                id: hItem.dishId,
                name: hItem.dishName,
                price: hItem.pricePerItem
            };
            
            // Добавляем нужное количество раз
            // (Можно оптимизировать, но так проще)
            const existing = this.items.find(i => i.dish.id === dish.id);
            if (existing) {
                existing.count += hItem.quantity;
            } else {
                this.items.push({ dish: dish, count: hItem.quantity });
            }
        });
        this._notifyCartChanged();
    }

    // Метод для обновления комментария
    updateItemComment(dishId, text) {
        const item = this.items.find(i => i.dish.id === dishId);
        if (item) {
            item.comment = text;
            // Сохраняем в localStorage, но НЕ вызываем notify(), 
            // чтобы не перерисовывать поле ввода пока человек пишет (иначе фокус слетит)
            localStorage.setItem('cart_items', JSON.stringify(this.items));
        }
    }
    
}